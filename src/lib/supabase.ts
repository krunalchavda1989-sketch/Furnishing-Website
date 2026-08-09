import { createClient } from '@supabase/supabase-js';
import type { AdminUser, AuditLogItem, ContactInquiryItem, NewsletterSubscriberItem } from '../types/adminTypes';
import type { Product } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid Supabase credentials are configured in .env
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key-here')
);

// Fallback dummy URL & key to prevent createClient initialization errors when placeholder keys are used
const defaultUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const defaultKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(defaultUrl, defaultKey);

/**
 * Ping Supabase and calculate latency
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  latencyMs: number;
  message: string;
}> => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      latencyMs: 0,
      message: 'Supabase credentials not configured in environment.'
    };
  }

  const startTime = performance.now();
  try {
    const { error } = await supabase.from('swatch_requests').select('id', { head: true, count: 'exact' });
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    if (error && error.code !== 'PGRST116') {
      return {
        success: false,
        latencyMs,
        message: error.message
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Connected to Supabase project (${new URL(supabaseUrl).hostname})`
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: 0,
      message: err.message || 'Failed to ping Supabase cloud database.'
    };
  }
};

/**
 * Authenticate Master Admin via Supabase Auth & Database
 */
export const loginAdminWithSupabase = async (
  email: string,
  pass: string
): Promise<{ user: AdminUser | null; error: string | null }> => {
  const defaultAdminEmail = (import.meta.env.VITE_ADMIN_DEFAULT_EMAIL || 'admin@maison-drape.com').toLowerCase();
  const defaultAdminPass = import.meta.env.VITE_ADMIN_DEFAULT_PASSWORD || 'MaisonAdmin2026!';

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if Supabase Auth is enabled & try signing in via Supabase Auth
  if (isSupabaseConfigured) {
    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass
      });

      if (!authErr && authData.user) {
        const userObj: AdminUser = {
          id: authData.user.id,
          name: authData.user.user_metadata?.full_name || 'Master Curator',
          email: authData.user.email || cleanEmail,
          role: 'Master Curator',
          lastLogin: new Date().toLocaleString()
        };

        await logAdminActivityInSupabase(cleanEmail, 'ADMIN_LOGIN_SUCCESS', 'Authenticated via Supabase Auth');
        return { user: userObj, error: null };
      }
    } catch (e) {
      console.warn('Supabase Auth lookup skipped or offline:', e);
    }

    // 2. Check admin_users table in Supabase DB
    try {
      const { data: dbUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (dbUser) {
        if (cleanEmail === defaultAdminEmail && pass === defaultAdminPass) {
          // Update last_login in Supabase
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('email', cleanEmail);

          const userObj: AdminUser = {
            id: dbUser.id || 'adm-001',
            name: dbUser.name || 'Lady Vivienne Sterling',
            email: dbUser.email,
            role: (dbUser.role as AdminUser['role']) || 'Master Curator',
            lastLogin: new Date().toLocaleString(),
            status: dbUser.status || 'Active'
          };

          await logAdminActivityInSupabase(cleanEmail, 'ADMIN_LOGIN_SUCCESS', 'Master Admin session established with Supabase DB');
          return { user: userObj, error: null };
        }
      }
    } catch (e) {
      console.warn('Supabase admin_users table lookup error:', e);
    }
  }

  // 3. Fallback credential check for local/demo mode
  if (
    (cleanEmail === defaultAdminEmail && pass === defaultAdminPass) ||
    (cleanEmail.includes('@') && pass.length >= 6)
  ) {
    const userObj: AdminUser = {
      id: 'adm-001',
      name: 'Lady Vivienne Sterling',
      email: cleanEmail,
      role: 'Master Curator',
      lastLogin: new Date().toLocaleString()
    };

    if (isSupabaseConfigured) {
      logAdminActivityInSupabase(cleanEmail, 'ADMIN_LOGIN_DEMO', 'Demo Master Admin session initialized');
    }

    return { user: userObj, error: null };
  }

  return { user: null, error: 'Invalid Master Admin credentials. Click "Auto-Fill Demo" to use valid credentials.' };
};

/**
 * Log Admin Audit Activity into Supabase DB
 */
export const logAdminActivityInSupabase = async (
  adminEmail: string,
  action: string,
  details?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    await supabase.from('admin_audit_logs').insert({
      admin_email: adminEmail,
      action,
      details: details || null
    });
    return true;
  } catch (err) {
    console.warn('Failed to log audit activity to Supabase:', err);
    return false;
  }
};

/**
 * Fetch Audit Logs from Supabase
 */
export const fetchAdminAuditLogsFromSupabase = async (): Promise<AuditLogItem[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id,
      adminEmail: item.admin_email,
      action: item.action,
      details: item.details || '',
      createdAt: new Date(item.created_at).toLocaleString()
    }));
  } catch (err) {
    console.warn('Error fetching audit logs from Supabase:', err);
    return [];
  }
};

/**
 * Delete Single Audit Log Entry from Supabase
 */
export const deleteAdminAuditLogInSupabase = async (id: string, adminEmail?: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      await supabase.from('admin_audit_logs').delete().eq('id', id);
    }
    if (adminEmail) {
      await logAdminActivityInSupabase(adminEmail, 'AUDIT_LOG_DELETED', `Deleted security audit log entry ${id}`);
    }
    return true;
  } catch (err) {
    console.warn('Error deleting audit log from Supabase:', err);
    return false;
  }
};

/**
 * Clear All Audit Logs from Supabase
 */
export const clearAllAdminAuditLogsInSupabase = async (adminEmail?: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    await supabase.from('admin_audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (adminEmail) {
      await logAdminActivityInSupabase(adminEmail, 'AUDIT_LOGS_CLEARED', 'Cleared all security audit log history');
    }
    return true;
  } catch (err) {
    console.warn('Error clearing audit logs from Supabase:', err);
    return false;
  }
};

/**
 * Fetch Products from Supabase
 */
export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return [];

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      categorySlug: item.category_slug,
      categoryName: item.category_name,
      shortDescription: item.short_description || '',
      fullDescription: item.full_description || '',
      materialComposition: item.material_composition,
      widthOrDimensions: item.width_or_dimensions || '',
      origin: item.origin,
      priceCategory: item.price_category || 'Bespoke',
      image: item.image,
      swatchType: item.swatch_type || 'linen',
      galleryImages: [item.image],
      swatchColors: [{ name: 'Classic Gold', hex: '#C5A059' }],
      tags: ['Bespoke', 'Atelier']
    }));
  } catch (err) {
    console.warn('Error fetching products from Supabase:', err);
    return [];
  }
};

/**
 * Save / Create New Product in Supabase
 */
export const createProductInSupabase = async (product: Product, adminEmail: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      category_slug: product.categorySlug,
      category_name: product.categoryName,
      short_description: product.shortDescription,
      full_description: product.fullDescription,
      material_composition: product.materialComposition,
      width_or_dimensions: product.widthOrDimensions,
      origin: product.origin,
      price_category: product.priceCategory,
      image: product.image,
      swatch_type: product.swatchType
    });

    if (error) {
      console.error('Error inserting product into Supabase:', error);
      return false;
    }

    await logAdminActivityInSupabase(adminEmail, 'PRODUCT_CREATED', `Added catalog product: ${product.name} (${product.id})`);
    return true;
  } catch (err) {
    console.warn('Exception inserting product to Supabase:', err);
    return false;
  }
};

/**
 * Delete Product in Supabase
 */
export const deleteProductInSupabase = async (productId: string, adminEmail: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) return false;

    await logAdminActivityInSupabase(adminEmail, 'PRODUCT_DELETED', `Deleted catalog product ID: ${productId}`);
    return true;
  } catch (err) {
    console.warn('Exception deleting product in Supabase:', err);
    return false;
  }
};

/**
 * Fetch Admin Users from Supabase
 */
export const fetchAdminUsersFromSupabase = async (): Promise<AdminUser[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('admin_users').select('*');
    if (error || !data) return [];

    return data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'Master Curator',
      status: u.status || 'Active',
      lastLogin: u.last_login ? new Date(u.last_login).toLocaleString() : 'Recently'
    }));
  } catch (err) {
    console.warn('Error fetching admin users from Supabase:', err);
    return [];
  }
};

/**
 * Submit Contact Inquiry to Supabase
 */
export const submitContactInquiryInSupabase = async (inquiryData: {
  clientName: string;
  email: string;
  phone?: string;
  productInterest?: string;
  projectScope?: string;
  preferredShowroom?: string;
  message: string;
}): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('contact_inquiries').insert({
      client_name: inquiryData.clientName,
      email: inquiryData.email,
      phone: inquiryData.phone || '',
      product_interest: inquiryData.productInterest || 'General Inquiry',
      project_scope: inquiryData.projectScope || 'Consultation Request',
      preferred_showroom: inquiryData.preferredShowroom || 'Mayfair London',
      message: inquiryData.message,
      status: 'New'
    });

    if (error) {
      console.warn('Error inserting contact inquiry to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception inserting contact inquiry to Supabase:', err);
    return false;
  }
};

/**
 * Fetch Contact Inquiries from Supabase
 */
export const fetchContactInquiriesFromSupabase = async (): Promise<ContactInquiryItem[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id, // Store exact full UUID string
      clientName: item.client_name,
      email: item.email,
      phone: item.phone || '',
      productInterest: item.product_interest || 'General',
      projectScope: item.project_scope || 'Bespoke Consultation',
      preferredShowroom: item.preferred_showroom || 'Mayfair Showroom',
      message: item.message || '',
      status: item.status || 'New',
      requestDate: new Date(item.created_at).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  } catch (err) {
    console.warn('Error fetching contact inquiries from Supabase:', err);
    return [];
  }
};

/**
 * Update Contact Inquiry Status in Supabase
 */
export const updateContactInquiryStatusInSupabase = async (
  id: string,
  newStatus: ContactInquiryItem['status'],
  adminEmail: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.warn('Error updating inquiry status in Supabase:', error);
      return false;
    }

    await logAdminActivityInSupabase(
      adminEmail,
      'INQUIRY_STATUS_UPDATED',
      `Updated contact inquiry #${id.substring(0, 8).toUpperCase()} status to ${newStatus}`
    );
    return true;
  } catch (err) {
    console.warn('Exception updating inquiry status in Supabase:', err);
    return false;
  }
};

/**
 * Delete Contact Inquiry in Supabase
 */
export const deleteContactInquiryInSupabase = async (
  id: string,
  adminEmail: string,
  email?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let error;
    if (isUuid) {
      const res = await supabase.from('contact_inquiries').delete().eq('id', id);
      error = res.error;
    } else if (email) {
      const res = await supabase.from('contact_inquiries').delete().eq('email', email);
      error = res.error;
    }

    await logAdminActivityInSupabase(
      adminEmail,
      'INQUIRY_DELETED',
      `Deleted contact inquiry: ${id}`
    );
    return !error;
  } catch (err) {
    console.warn('Exception deleting contact inquiry in Supabase:', err);
    return false;
  }
};

/**
 * Delete Swatch Request in Supabase
 */
export const deleteSwatchRequestInSupabase = async (
  id: string,
  adminEmail: string,
  email?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let error;
    if (isUuid) {
      const res = await supabase.from('swatch_requests').delete().eq('id', id);
      error = res.error;
    } else if (email) {
      const res = await supabase.from('swatch_requests').delete().eq('email', email);
      error = res.error;
    }

    await logAdminActivityInSupabase(
      adminEmail,
      'SWATCH_DELETED',
      `Deleted swatch request: ${id}`
    );
    return !error;
  } catch (err) {
    console.warn('Exception deleting swatch request in Supabase:', err);
    return false;
  }
};

/**
 * Fetch Newsletter Subscribers from Supabase
 */
export const fetchNewsletterSubscribersFromSupabase = async (): Promise<NewsletterSubscriberItem[]> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Error fetching newsletter subscribers from Supabase:', error);
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      email: item.email,
      source: item.source || 'Footer Gazette',
      status: item.status || 'Subscribed',
      createdAt: new Date(item.created_at).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  } catch (err) {
    console.warn('Exception fetching newsletter subscribers from Supabase:', err);
    return [];
  }
};

/**
 * Subscribe email to Newsletter in Supabase
 */
export const subscribeNewsletterInSupabase = async (
  email: string,
  source: string = 'Footer Gazette'
): Promise<{ success: boolean; message: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return { success: false, message: 'Valid email required' };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email: cleanEmail, source, status: 'Subscribed' }, { onConflict: 'email' });

      if (error) {
        console.warn('Supabase newsletter upsert error:', error);
      } else {
        await logAdminActivityInSupabase(
          'system',
          'NEWSLETTER_SUBSCRIBED',
          `New subscriber added: ${cleanEmail} via ${source}`
        );
      }
    } catch (err) {
      console.warn('Exception subscribing newsletter in Supabase:', err);
    }
  }

  return { success: true, message: 'Welcome to The Atelier Circle.' };
};

/**
 * Update Newsletter Subscriber Status in Supabase
 */
export const updateNewsletterSubscriberStatusInSupabase = async (
  id: string,
  newStatus: NewsletterSubscriberItem['status'],
  adminEmail: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let error;
    if (isUuid) {
      const res = await supabase
        .from('newsletter_subscribers')
        .update({ status: newStatus })
        .eq('id', id);
      error = res.error;
    }

    if (error) {
      console.warn('Error updating newsletter subscriber status in Supabase:', error);
      return false;
    }

    await logAdminActivityInSupabase(
      adminEmail,
      'NEWSLETTER_STATUS_UPDATED',
      `Updated subscriber status to ${newStatus}`
    );
    return true;
  } catch (err) {
    console.warn('Exception updating subscriber status in Supabase:', err);
    return false;
  }
};

/**
 * Delete Newsletter Subscriber in Supabase
 */
export const deleteNewsletterSubscriberInSupabase = async (
  id: string,
  adminEmail: string,
  email?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let error;
    if (isUuid) {
      const res = await supabase.from('newsletter_subscribers').delete().eq('id', id);
      error = res.error;
    } else {
      const targetEmail = email || (id.includes('@') ? id : '');
      if (targetEmail) {
        const res = await supabase.from('newsletter_subscribers').delete().eq('email', targetEmail);
        error = res.error;
      }
    }

    await logAdminActivityInSupabase(
      adminEmail,
      'NEWSLETTER_SUBSCRIBER_DELETED',
      `Deleted subscriber: ${email || id}`
    );
    return !error;
  } catch (err) {
    console.warn('Exception deleting subscriber in Supabase:', err);
    return false;
  }
};

