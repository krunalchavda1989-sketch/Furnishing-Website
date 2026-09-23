import { createClient } from '@supabase/supabase-js';
import type { AdminUser, AuditLogItem, ContactInquiryItem, NewsletterSubscriberItem } from '../types/adminTypes';
import type {
  Product,
  Showroom,
  ContactSettings,
  Project,
  SiteSettings,
  HeaderNavLink,
  Testimonial,
  BrandPartner,
  StorySettings,
  FurnishingScene,
  MarketingSettings,
  PageSEOConfig
} from '../types';
import { SHOWROOMS_DATA, BRANDS_DATA } from '../data/brandsData';
import { PROJECTS_DATA } from '../data/projectsData';

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
  const defaultAdminEmail = (import.meta.env.VITE_ADMIN_DEFAULT_EMAIL || 'admin@atelier-living.com').toLowerCase();
  const defaultAdminPass = import.meta.env.VITE_ADMIN_DEFAULT_PASSWORD || 'AtelierAdmin2026!';

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

  return { user: null, error: 'Invalid Master Admin credentials. Please verify your email and password.' };
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
      swatchColors: [{ name: 'Classic Gold', hex: '#C9A56A' }],
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
 * Update Existing Product in Supabase
 */
export const updateProductInSupabase = async (product: Product, adminEmail: string): Promise<boolean> => {
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
      console.error('Error updating product in Supabase:', error);
      return false;
    }

    await logAdminActivityInSupabase(adminEmail, 'PRODUCT_UPDATED', `Updated catalog product: ${product.name} (${product.id})`);
    return true;
  } catch (err) {
    console.warn('Exception updating product in Supabase:', err);
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

export const DEFAULT_HEADER_NAV_LINKS: HeaderNavLink[] = [
  { id: 'home', label: 'Home', target: 'home', isVisible: true, order: 1 },
  { id: 'story', label: 'Our Story', target: 'story', isVisible: true, order: 2 },
  { id: 'catalogue', label: 'Product Catalogue', target: 'catalogue', hasMegaMenu: true, isVisible: true, order: 3 },
  { id: 'projects', label: 'Our Projects', target: 'projects', isVisible: true, order: 4 },
  { id: 'brands', label: 'Brands With Us', target: 'brands', isVisible: true, order: 5 },
  { id: 'contact', label: 'Contact Us', target: 'contact', isVisible: true, order: 6 }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'default',
  headerLogoImage: '',
  headerLogoMonogram: 'A',
  headerLogoTitle: 'Atelier Living',
  headerLogoSubtitle: 'Designed For Inspired Living',

  // Header Styling & Layout Options
  headerFontSize: '13px',
  headerItemSpacing: '24px',
  headerFontWeight: '600',
  headerLetterSpacing: 'widest',
  headerTextTransform: 'uppercase',
  headerHeight: 'standard',
  headerAlignment: 'center',
  headerLogoHeight: 40,
  headerSticky: true,
  headerBackgroundStyle: 'emerald',
  headerBorderBottom: 'gold',

  // Top Announcement / Utility Bar
  headerTopBarEnabled: false,
  headerTopBarText: 'Complimentary Worldwide White-Glove Courier On Orders Over $1,000 | Private Showroom Consultations Available',
  headerTopBarLink: 'contact',
  headerTopBarBg: 'gold',

  // Header Action Buttons
  headerShowSwatchesBtn: true,
  headerShowSearch: true,
  headerShowConcierge: true,
  headerShowCart: true,

  footerLogoImage: '',
  footerLogoMonogram: 'A',
  footerLogoTitle: 'Atelier Living',
  footerDescription:
    'Atelier Living is an international interior design house crafting bespoke textiles, architectural drapes, structural upholstery, hand-knotted rugs, and limited-edition atelier artifacts for fine private residences, superyachts, and boutique luxury hotels.',
  footerCopyright: `© ${new Date().getFullYear()} Atelier Living Ltd. All rights reserved.`,

  navLinks: DEFAULT_HEADER_NAV_LINKS,

  socialLinks: {
    instagram: { enabled: true, url: 'https://instagram.com/atelierliving', label: 'Instagram' },
    pinterest: { enabled: true, url: 'https://pinterest.com/atelierliving', label: 'Pinterest' },
    linkedin: { enabled: true, url: 'https://linkedin.com/company/atelier-living', label: 'LinkedIn' },
    youtube: { enabled: true, url: 'https://youtube.com/@atelierliving', label: 'YouTube' },
    facebook: { enabled: true, url: 'https://facebook.com/atelierliving', label: 'Facebook' },
    twitter: { enabled: false, url: 'https://twitter.com/atelierliving', label: 'X / Twitter' },
    whatsapp: { enabled: true, url: 'https://wa.me/447911123456', label: 'WhatsApp Concierge' }
  },

  companyName: 'Atelier Living Ltd',
  primaryPhone: '+44 (0)20 7946 0188',
  mobileNumber: '+44 7911 123456',
  whatsappNumber: '+44 7911 123456',
  generalEmail: 'concierge@atelier-living.com',
  vipEmail: 'vip@atelier-living.com',
  pressEmail: 'press@atelier-living.com',
  tradeEmail: 'trade@atelier-living.com',
  flagshipAddress: '48 Berkeley Square, Mayfair, London W1J 5AW',

  scheduleMonFri: '09:30 - 18:30',
  scheduleSat: '10:00 - 17:00',
  scheduleSun: 'By Private Appointment Only',
  scheduleHolidays: 'Closed on UK & EU Bank Holidays',

  // Floating WhatsApp Concierge Widget
  whatsappFloatingEnabled: true,
  whatsappFloatingPosition: 'bottom-right',
  whatsappFloatingNumber: '+44 7911 123456',
  whatsappFloatingMessage: 'Hello Atelier Living Concierge, I would like to inquire about bespoke furnishings.',
  whatsappFloatingTooltip: 'Chat with Concierge'
};

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  id: 'default',
  companyName: 'Atelier Living Ltd',
  primaryPhone: '+44 (0)20 7946 0188',
  mobileNumber: '+44 7911 123456',
  whatsappNumber: '+44 7911 123456',
  generalEmail: 'concierge@atelier-living.com',
  vipEmail: 'vip@atelier-living.com',
  pressEmail: 'press@atelier-living.com',
  tradeEmail: 'trade@atelier-living.com',
  scheduleMonFri: '09:30 - 18:30',
  scheduleSat: '10:00 - 17:00',
  scheduleSun: 'By Private Appointment Only',
  scheduleHolidays: 'Closed on UK & EU Bank Holidays',
  instagramUrl: 'https://instagram.com/atelierliving',
  pinterestUrl: 'https://pinterest.com/atelierliving',
  linkedinUrl: 'https://linkedin.com/company/atelier-living',
  youtubeUrl: 'https://youtube.com/@atelierliving',
  twitterUrl: 'https://twitter.com/atelierliving',
  facebookUrl: 'https://facebook.com/atelierliving'
};

/**
 * Fetch Showroom Locations from Supabase with LocalStorage and Seed Fallbacks
 */
export const fetchShowroomsFromSupabase = async (): Promise<Showroom[]> => {
  // Read deleted showroom keys
  const getDeletedShowrooms = (): string[] => {
    try {
      const data = localStorage.getItem('atelier_deleted_showrooms') || localStorage.getItem('maison_deleted_showrooms');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const deletedKeys = getDeletedShowrooms();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('showrooms')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data
          .map((item) => ({
            id: item.id,
            city: item.city,
            country: item.country,
            address: item.address,
            phone: item.phone,
            email: item.email,
            hours: item.hours,
            image: item.image,
            coordinates: {
              lat: item.lat ?? 0,
              lng: item.lng ?? 0
            },
            isFlagship: Boolean(item.is_flagship),
            notes: item.notes || ''
          }))
          .filter((s) => !deletedKeys.includes(s.id));
      }
    } catch (err) {
      console.warn('Error fetching showrooms from Supabase:', err);
    }
  }

  // Fallback to local storage custom additions merged with default seed
  try {
    const custom = localStorage.getItem('atelier_custom_showrooms');
    let list: Showroom[] = SHOWROOMS_DATA;
    if (custom) {
      const parsed: Showroom[] = JSON.parse(custom);
      // Merge or replace
      const customMap = new Map<string, Showroom>();
      list.forEach((s) => customMap.set(s.id, s));
      parsed.forEach((s) => customMap.set(s.id, s));
      list = Array.from(customMap.values());
    }
    return list.filter((s) => !deletedKeys.includes(s.id));
  } catch {
    return SHOWROOMS_DATA.filter((s) => !deletedKeys.includes(s.id));
  }
};

/**
 * Create or Update Showroom Location in Supabase & LocalStorage
 */
export const createOrUpdateShowroomInSupabase = async (
  showroom: Showroom,
  adminEmail: string
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    const custom = localStorage.getItem('atelier_custom_showrooms');
    let list: Showroom[] = custom ? JSON.parse(custom) : [...SHOWROOMS_DATA];
    const existingIndex = list.findIndex((s) => s.id === showroom.id);
    if (existingIndex >= 0) {
      list[existingIndex] = showroom;
    } else {
      list.push(showroom);
    }
    localStorage.setItem('atelier_custom_showrooms', JSON.stringify(list));

    // Remove from deleted list if present
    const delData = localStorage.getItem('atelier_deleted_showrooms');
    if (delData) {
      const delList: string[] = JSON.parse(delData);
      localStorage.setItem('atelier_deleted_showrooms', JSON.stringify(delList.filter((id) => id !== showroom.id)));
    }
  } catch (e) {
    console.warn('LocalStorage showroom save error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('showrooms').upsert({
        id: showroom.id,
        city: showroom.city,
        country: showroom.country,
        address: showroom.address,
        phone: showroom.phone,
        email: showroom.email,
        hours: showroom.hours,
        image: showroom.image,
        lat: showroom.coordinates?.lat || 0,
        lng: showroom.coordinates?.lng || 0,
        is_flagship: Boolean(showroom.isFlagship),
        notes: showroom.notes || null
      });

      if (error) {
        console.warn('Supabase showroom upsert error:', error);
      } else {
        await logAdminActivityInSupabase(
          adminEmail,
          'SHOWROOM_UPDATED',
          `Saved showroom location: ${showroom.city} (${showroom.country}) [${showroom.id}]`
        );
      }
    } catch (err) {
      console.warn('Exception updating showroom in Supabase:', err);
    }
  }

  return true;
};

/**
 * Delete Showroom Location in Supabase & LocalStorage
 */
export const deleteShowroomInSupabase = async (
  showroomId: string,
  adminEmail: string
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    const delData = localStorage.getItem('atelier_deleted_showrooms');
    const delList: string[] = delData ? JSON.parse(delData) : [];
    if (!delList.includes(showroomId)) {
      delList.push(showroomId);
      localStorage.setItem('atelier_deleted_showrooms', JSON.stringify(delList));
    }

    const custom = localStorage.getItem('atelier_custom_showrooms');
    if (custom) {
      const parsed: Showroom[] = JSON.parse(custom);
      localStorage.setItem(
        'atelier_custom_showrooms',
        JSON.stringify(parsed.filter((s) => s.id !== showroomId))
      );
    }
  } catch (e) {
    console.warn('LocalStorage showroom delete error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from('showrooms').delete().eq('id', showroomId);
      await logAdminActivityInSupabase(
        adminEmail,
        'SHOWROOM_DELETED',
        `Deleted showroom location: ${showroomId}`
      );
    } catch (err) {
      console.warn('Exception deleting showroom from Supabase:', err);
    }
  }

  return true;
};

/**
 * Fetch Global Contact Settings from Supabase or LocalStorage
 */
export const fetchContactSettingsFromSupabase = async (): Promise<ContactSettings> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          companyName: data.company_name || DEFAULT_CONTACT_SETTINGS.companyName,
          primaryPhone: data.primary_phone || DEFAULT_CONTACT_SETTINGS.primaryPhone,
          mobileNumber: data.mobile_number || DEFAULT_CONTACT_SETTINGS.mobileNumber,
          whatsappNumber: data.whatsapp_number || DEFAULT_CONTACT_SETTINGS.whatsappNumber,
          generalEmail: data.general_email || DEFAULT_CONTACT_SETTINGS.generalEmail,
          vipEmail: data.vip_email || DEFAULT_CONTACT_SETTINGS.vipEmail,
          pressEmail: data.press_email || DEFAULT_CONTACT_SETTINGS.pressEmail,
          tradeEmail: data.trade_email || DEFAULT_CONTACT_SETTINGS.tradeEmail,
          scheduleMonFri: data.schedule_mon_fri || DEFAULT_CONTACT_SETTINGS.scheduleMonFri,
          scheduleSat: data.schedule_sat || DEFAULT_CONTACT_SETTINGS.scheduleSat,
          scheduleSun: data.schedule_sun || DEFAULT_CONTACT_SETTINGS.scheduleSun,
          scheduleHolidays: data.schedule_holidays || DEFAULT_CONTACT_SETTINGS.scheduleHolidays,
          instagramUrl: data.instagram_url || DEFAULT_CONTACT_SETTINGS.instagramUrl,
          pinterestUrl: data.pinterest_url || DEFAULT_CONTACT_SETTINGS.pinterestUrl,
          linkedinUrl: data.linkedin_url || DEFAULT_CONTACT_SETTINGS.linkedinUrl,
          youtubeUrl: data.youtube_url || DEFAULT_CONTACT_SETTINGS.youtubeUrl,
          twitterUrl: data.twitter_url || DEFAULT_CONTACT_SETTINGS.twitterUrl,
          facebookUrl: data.facebook_url || DEFAULT_CONTACT_SETTINGS.facebookUrl,
          updatedAt: data.updated_at
        };
      }
    } catch (err) {
      console.warn('Error fetching contact settings from Supabase:', err);
    }
  }

  // Fallback to local storage or defaults
  try {
    const saved = localStorage.getItem('atelier_contact_settings');
    if (saved) {
      return { ...DEFAULT_CONTACT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error reading contact settings from localStorage:', e);
  }

  return DEFAULT_CONTACT_SETTINGS;
};

/**
 * Update Global Contact Settings in Supabase & LocalStorage
 */
export const updateContactSettingsInSupabase = async (
  settings: ContactSettings,
  adminEmail: string
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    localStorage.setItem('atelier_contact_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('LocalStorage contact settings save error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('contact_settings').upsert({
        id: 'default',
        company_name: settings.companyName,
        primary_phone: settings.primaryPhone,
        mobile_number: settings.mobileNumber,
        whatsapp_number: settings.whatsappNumber,
        general_email: settings.generalEmail,
        vip_email: settings.vipEmail,
        press_email: settings.pressEmail,
        trade_email: settings.tradeEmail,
        schedule_mon_fri: settings.scheduleMonFri,
        schedule_sat: settings.scheduleSat,
        schedule_sun: settings.scheduleSun,
        schedule_holidays: settings.scheduleHolidays,
        instagram_url: settings.instagramUrl,
        pinterest_url: settings.pinterestUrl,
        linkedin_url: settings.linkedinUrl,
        youtube_url: settings.youtubeUrl,
        twitter_url: settings.twitterUrl,
        facebook_url: settings.facebookUrl,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.warn('Supabase contact settings upsert error:', error);
      } else {
        await logAdminActivityInSupabase(
          adminEmail,
          'CONTACT_SETTINGS_UPDATED',
          'Updated global contact info, mobile numbers, schedule, and social media channels'
        );
      }
    } catch (err) {
      console.warn('Exception updating contact settings in Supabase:', err);
    }
  }

  return true;
};

/**
 * Fetch Comprehensive Site Branding, Navigation & Global Settings
 */
export const fetchSiteSettingsFromSupabase = async (): Promise<SiteSettings> => {
  let settings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

  // 1. Try fetching from Supabase site_settings table
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        settings = {
          id: data.id,
          headerLogoImage: data.header_logo_image ?? DEFAULT_SITE_SETTINGS.headerLogoImage,
          headerLogoMonogram: data.header_logo_monogram || DEFAULT_SITE_SETTINGS.headerLogoMonogram,
          headerLogoTitle: data.header_logo_title || DEFAULT_SITE_SETTINGS.headerLogoTitle,
          headerLogoSubtitle: data.header_logo_subtitle || DEFAULT_SITE_SETTINGS.headerLogoSubtitle,

          // Header Styling & Layout Options
          headerFontSize: data.header_font_size || DEFAULT_SITE_SETTINGS.headerFontSize,
          headerItemSpacing: data.header_item_spacing || DEFAULT_SITE_SETTINGS.headerItemSpacing,
          headerFontWeight: data.header_font_weight || DEFAULT_SITE_SETTINGS.headerFontWeight,
          headerLetterSpacing: data.header_letter_spacing || DEFAULT_SITE_SETTINGS.headerLetterSpacing,
          headerTextTransform: data.header_text_transform || DEFAULT_SITE_SETTINGS.headerTextTransform,
          headerHeight: data.header_height || DEFAULT_SITE_SETTINGS.headerHeight,
          headerAlignment: data.header_alignment || DEFAULT_SITE_SETTINGS.headerAlignment,
          headerLogoHeight: data.header_logo_height ?? DEFAULT_SITE_SETTINGS.headerLogoHeight,
          headerSticky: data.header_sticky ?? DEFAULT_SITE_SETTINGS.headerSticky,
          headerBackgroundStyle: data.header_background_style || DEFAULT_SITE_SETTINGS.headerBackgroundStyle,
          headerBorderBottom: data.header_border_bottom || DEFAULT_SITE_SETTINGS.headerBorderBottom,

          // Top Announcement Bar
          headerTopBarEnabled: data.header_top_bar_enabled ?? DEFAULT_SITE_SETTINGS.headerTopBarEnabled,
          headerTopBarText: data.header_top_bar_text || DEFAULT_SITE_SETTINGS.headerTopBarText,
          headerTopBarLink: data.header_top_bar_link || DEFAULT_SITE_SETTINGS.headerTopBarLink,
          headerTopBarBg: data.header_top_bar_bg || DEFAULT_SITE_SETTINGS.headerTopBarBg,

          // Header Action Buttons
          headerShowSwatchesBtn: data.header_show_swatches_btn ?? DEFAULT_SITE_SETTINGS.headerShowSwatchesBtn,
          headerShowSearch: data.header_show_search ?? DEFAULT_SITE_SETTINGS.headerShowSearch,
          headerShowConcierge: data.header_show_concierge ?? DEFAULT_SITE_SETTINGS.headerShowConcierge,
          headerShowCart: data.header_show_cart ?? DEFAULT_SITE_SETTINGS.headerShowCart,

          footerLogoImage: data.footer_logo_image ?? DEFAULT_SITE_SETTINGS.footerLogoImage,
          footerLogoMonogram: data.footer_logo_monogram || DEFAULT_SITE_SETTINGS.footerLogoMonogram,
          footerLogoTitle: data.footer_logo_title || DEFAULT_SITE_SETTINGS.footerLogoTitle,
          footerDescription: data.footer_description || DEFAULT_SITE_SETTINGS.footerDescription,
          footerCopyright: data.footer_copyright || DEFAULT_SITE_SETTINGS.footerCopyright,

          navLinks: data.nav_links && Array.isArray(data.nav_links) && data.nav_links.length > 0
            ? data.nav_links
            : DEFAULT_SITE_SETTINGS.navLinks,

          socialLinks: data.social_links
            ? { ...DEFAULT_SITE_SETTINGS.socialLinks, ...data.social_links }
            : DEFAULT_SITE_SETTINGS.socialLinks,

          companyName: data.company_name || DEFAULT_SITE_SETTINGS.companyName,
          primaryPhone: data.primary_phone || DEFAULT_SITE_SETTINGS.primaryPhone,
          mobileNumber: data.mobile_number || DEFAULT_SITE_SETTINGS.mobileNumber,
          whatsappNumber: data.whatsapp_number || DEFAULT_SITE_SETTINGS.whatsappNumber,
          generalEmail: data.general_email || DEFAULT_SITE_SETTINGS.generalEmail,
          vipEmail: data.vip_email || DEFAULT_SITE_SETTINGS.vipEmail,
          pressEmail: data.press_email || DEFAULT_SITE_SETTINGS.pressEmail,
          tradeEmail: data.trade_email || DEFAULT_SITE_SETTINGS.tradeEmail,
          flagshipAddress: data.flagship_address || DEFAULT_SITE_SETTINGS.flagshipAddress,

          scheduleMonFri: data.schedule_mon_fri || DEFAULT_SITE_SETTINGS.scheduleMonFri,
          scheduleSat: data.schedule_sat || DEFAULT_SITE_SETTINGS.scheduleSat,
          scheduleSun: data.schedule_sun || DEFAULT_SITE_SETTINGS.scheduleSun,
          scheduleHolidays: data.schedule_holidays || DEFAULT_SITE_SETTINGS.scheduleHolidays,

          // Floating WhatsApp Concierge Widget
          whatsappFloatingEnabled: data.whatsapp_floating_enabled ?? DEFAULT_SITE_SETTINGS.whatsappFloatingEnabled,
          whatsappFloatingPosition: data.whatsapp_floating_position || DEFAULT_SITE_SETTINGS.whatsappFloatingPosition,
          whatsappFloatingNumber: data.whatsapp_floating_number || DEFAULT_SITE_SETTINGS.whatsappFloatingNumber,
          whatsappFloatingMessage: data.whatsapp_floating_message || DEFAULT_SITE_SETTINGS.whatsappFloatingMessage,
          whatsappFloatingTooltip: data.whatsapp_floating_tooltip || DEFAULT_SITE_SETTINGS.whatsappFloatingTooltip,

          updatedAt: data.updated_at
        };

        return settings;
      }
    } catch (err) {
      console.warn('Error fetching site settings from Supabase:', err);
    }
  }

  // 2. Fallback to LocalStorage
  try {
    const saved = localStorage.getItem('atelier_site_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        socialLinks: { ...DEFAULT_SITE_SETTINGS.socialLinks, ...(parsed.socialLinks || {}) }
      };
    }

    // Also check older contact_settings key if present
    const legacyContact = localStorage.getItem('atelier_contact_settings');
    if (legacyContact) {
      const parsedLegacy = JSON.parse(legacyContact);
      return {
        ...DEFAULT_SITE_SETTINGS,
        companyName: parsedLegacy.companyName || DEFAULT_SITE_SETTINGS.companyName,
        primaryPhone: parsedLegacy.primaryPhone || DEFAULT_SITE_SETTINGS.primaryPhone,
        mobileNumber: parsedLegacy.mobileNumber || DEFAULT_SITE_SETTINGS.mobileNumber,
        whatsappNumber: parsedLegacy.whatsappNumber || DEFAULT_SITE_SETTINGS.whatsappNumber,
        generalEmail: parsedLegacy.generalEmail || DEFAULT_SITE_SETTINGS.generalEmail,
        vipEmail: parsedLegacy.vipEmail || DEFAULT_SITE_SETTINGS.vipEmail,
        scheduleMonFri: parsedLegacy.scheduleMonFri || DEFAULT_SITE_SETTINGS.scheduleMonFri,
        scheduleSat: parsedLegacy.scheduleSat || DEFAULT_SITE_SETTINGS.scheduleSat,
        scheduleSun: parsedLegacy.scheduleSun || DEFAULT_SITE_SETTINGS.scheduleSun
      };
    }
  } catch (e) {
    console.warn('Error reading site settings from localStorage:', e);
  }

  return DEFAULT_SITE_SETTINGS;
};

/**
 * Update Comprehensive Site Branding, Navigation & Global Settings
 */
export const updateSiteSettingsInSupabase = async (
  settings: SiteSettings,
  adminEmail: string
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    localStorage.setItem('atelier_site_settings', JSON.stringify(settings));

    // Also maintain legacy contact_settings for backward compatibility
    const legacyContact: ContactSettings = {
      id: 'default',
      companyName: settings.companyName,
      primaryPhone: settings.primaryPhone,
      mobileNumber: settings.mobileNumber,
      whatsappNumber: settings.whatsappNumber,
      generalEmail: settings.generalEmail,
      vipEmail: settings.vipEmail,
      pressEmail: settings.pressEmail,
      tradeEmail: settings.tradeEmail,
      scheduleMonFri: settings.scheduleMonFri,
      scheduleSat: settings.scheduleSat,
      scheduleSun: settings.scheduleSun,
      scheduleHolidays: settings.scheduleHolidays,
      instagramUrl: settings.socialLinks.instagram?.url,
      pinterestUrl: settings.socialLinks.pinterest?.url,
      linkedinUrl: settings.socialLinks.linkedin?.url,
      youtubeUrl: settings.socialLinks.youtube?.url,
      twitterUrl: settings.socialLinks.twitter?.url,
      facebookUrl: settings.socialLinks.facebook?.url,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('atelier_contact_settings', JSON.stringify(legacyContact));
  } catch (e) {
    console.warn('LocalStorage site settings save error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'default',
        header_logo_image: settings.headerLogoImage,
        header_logo_monogram: settings.headerLogoMonogram,
        header_logo_title: settings.headerLogoTitle,
        header_logo_subtitle: settings.headerLogoSubtitle,

        // Header Styling & Layout Options
        header_font_size: settings.headerFontSize,
        header_item_spacing: settings.headerItemSpacing,
        header_font_weight: settings.headerFontWeight,
        header_letter_spacing: settings.headerLetterSpacing,
        header_text_transform: settings.headerTextTransform,
        header_height: settings.headerHeight,
        header_alignment: settings.headerAlignment,
        header_logo_height: settings.headerLogoHeight,
        header_sticky: settings.headerSticky,
        header_background_style: settings.headerBackgroundStyle,
        header_border_bottom: settings.headerBorderBottom,

        // Top Announcement Bar
        header_top_bar_enabled: settings.headerTopBarEnabled,
        header_top_bar_text: settings.headerTopBarText,
        header_top_bar_link: settings.headerTopBarLink,
        header_top_bar_bg: settings.headerTopBarBg,

        // Header Action Buttons
        header_show_swatches_btn: settings.headerShowSwatchesBtn,
        header_show_search: settings.headerShowSearch,
        header_show_concierge: settings.headerShowConcierge,
        header_show_cart: settings.headerShowCart,

        footer_logo_image: settings.footerLogoImage,
        footer_logo_monogram: settings.footerLogoMonogram,
        footer_logo_title: settings.footerLogoTitle,
        footer_description: settings.footerDescription,
        footer_copyright: settings.footerCopyright,

        nav_links: settings.navLinks,
        social_links: settings.socialLinks,

        company_name: settings.companyName,
        primary_phone: settings.primaryPhone,
        mobile_number: settings.mobileNumber,
        whatsapp_number: settings.whatsappNumber,
        general_email: settings.generalEmail,
        vip_email: settings.vipEmail,
        press_email: settings.pressEmail,
        trade_email: settings.tradeEmail,
        flagship_address: settings.flagshipAddress,

        schedule_mon_fri: settings.scheduleMonFri,
        schedule_sat: settings.scheduleSat,
        schedule_sun: settings.scheduleSun,
        schedule_holidays: settings.scheduleHolidays,

        // Floating WhatsApp Concierge Widget
        whatsapp_floating_enabled: settings.whatsappFloatingEnabled,
        whatsapp_floating_position: settings.whatsappFloatingPosition,
        whatsapp_floating_number: settings.whatsappFloatingNumber,
        whatsapp_floating_message: settings.whatsappFloatingMessage,
        whatsapp_floating_tooltip: settings.whatsappFloatingTooltip,

        updated_at: new Date().toISOString()
      });

      if (error) {
        console.warn('Supabase site_settings upsert notice:', error);
      }

      // Also upsert contact_settings table in parallel
      await supabase.from('contact_settings').upsert({
        id: 'default',
        company_name: settings.companyName,
        primary_phone: settings.primaryPhone,
        mobile_number: settings.mobileNumber,
        whatsapp_number: settings.whatsappNumber,
        general_email: settings.generalEmail,
        vip_email: settings.vipEmail,
        press_email: settings.pressEmail,
        trade_email: settings.tradeEmail,
        schedule_mon_fri: settings.scheduleMonFri,
        schedule_sat: settings.scheduleSat,
        schedule_sun: settings.scheduleSun,
        schedule_holidays: settings.scheduleHolidays,
        instagram_url: settings.socialLinks.instagram?.url,
        pinterest_url: settings.socialLinks.pinterest?.url,
        linkedin_url: settings.socialLinks.linkedin?.url,
        youtube_url: settings.socialLinks.youtube?.url,
        twitter_url: settings.socialLinks.twitter?.url,
        facebook_url: settings.socialLinks.facebook?.url,
        updated_at: new Date().toISOString()
      });

      await logAdminActivityInSupabase(
        adminEmail,
        'SITE_SETTINGS_UPDATED',
        'Updated site branding, header menu navigation links, logos, socials, and contact coordinates'
      );
    } catch (err) {
      console.warn('Exception updating site settings in Supabase:', err);
    }
  }

  return true;
};

/**
 * Fetch Projects / Portfolio from Supabase with LocalStorage and Seed Fallbacks
 */
export const fetchProjectsFromSupabase = async (): Promise<Project[]> => {
  const getDeletedProjects = (): string[] => {
    try {
      const data = localStorage.getItem('atelier_deleted_projects') || localStorage.getItem('maison_deleted_projects');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const deletedKeys = getDeletedProjects();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data
          .map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            location: item.location,
            year: item.year,
            heroImage: item.hero_image,
            gallery: item.gallery && item.gallery.length > 0 ? item.gallery : [item.hero_image],
            description: item.description,
            designer: item.designer,
            productsUsed: item.products_used || []
          }))
          .filter((p) => !deletedKeys.includes(p.id));
      }
    } catch (err) {
      console.warn('Error fetching projects from Supabase:', err);
    }
  }

  // Fallback to local storage custom additions merged with default seed
  try {
    const custom = localStorage.getItem('atelier_custom_projects');
    let list: Project[] = PROJECTS_DATA;
    if (custom) {
      const parsed: Project[] = JSON.parse(custom);
      const customMap = new Map<string, Project>();
      list.forEach((p) => customMap.set(p.id, p));
      parsed.forEach((p) => customMap.set(p.id, p));
      list = Array.from(customMap.values());
    }
    return list.filter((p) => !deletedKeys.includes(p.id));
  } catch {
    return PROJECTS_DATA.filter((p) => !deletedKeys.includes(p.id));
  }
};

/**
 * Create or Update Project in Supabase & LocalStorage
 */
export const createOrUpdateProjectInSupabase = async (
  project: Project,
  adminEmail: string
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    const custom = localStorage.getItem('atelier_custom_projects');
    let list: Project[] = custom ? JSON.parse(custom) : [...PROJECTS_DATA];
    const existingIndex = list.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      list[existingIndex] = project;
    } else {
      list.unshift(project);
    }
    localStorage.setItem('atelier_custom_projects', JSON.stringify(list));

    // Remove from deleted list if present
    const delData = localStorage.getItem('atelier_deleted_projects');
    if (delData) {
      const delList: string[] = JSON.parse(delData);
      localStorage.setItem('atelier_deleted_projects', JSON.stringify(delList.filter((id) => id !== project.id)));
    }
  } catch (e) {
    console.warn('LocalStorage project save error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').upsert({
        id: project.id,
        title: project.title,
        category: project.category,
        location: project.location,
        year: project.year,
        hero_image: project.heroImage,
        gallery: project.gallery && project.gallery.length > 0 ? project.gallery : [project.heroImage],
        description: project.description,
        designer: project.designer,
        products_used: project.productsUsed || []
      });

      if (error) {
        console.warn('Supabase project upsert error:', error);
      } else {
        await logAdminActivityInSupabase(
          adminEmail,
          'PROJECT_UPDATED',
          `Saved portfolio project: ${project.title} (${project.location}) [${project.id}]`
        );
      }
    } catch (err) {
      console.warn('Exception updating project in Supabase:', err);
    }
  }

  return true;
};

/**
 * Delete Project from Supabase & LocalStorage
 */
export const deleteProjectInSupabase = async (
  projectId: string,
  adminEmail: string
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    const delData = localStorage.getItem('atelier_deleted_projects');
    const delList: string[] = delData ? JSON.parse(delData) : [];
    if (!delList.includes(projectId)) {
      delList.push(projectId);
      localStorage.setItem('atelier_deleted_projects', JSON.stringify(delList));
    }

    const custom = localStorage.getItem('atelier_custom_projects');
    if (custom) {
      const parsed: Project[] = JSON.parse(custom);
      localStorage.setItem(
        'atelier_custom_projects',
        JSON.stringify(parsed.filter((p) => p.id !== projectId))
      );
    }
  } catch (e) {
    console.warn('LocalStorage project delete error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from('projects').delete().eq('id', projectId);
      await logAdminActivityInSupabase(
        adminEmail,
        'PROJECT_DELETED',
        `Deleted portfolio project: ${projectId}`
      );
    } catch (err) {
      console.warn('Exception deleting project from Supabase:', err);
    }
  }

  return true;
};

// =======================================================
// 12. DYNAMIC TESTIMONIALS & CLIENT REVIEWS CMS
// =======================================================

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tst-01',
    clientName: 'Lady Clarissa Montgomery',
    clientRole: 'Private Collector & Architectural Patron',
    location: 'Belgravia Residence, London',
    quote: 'Working with Atelier Living on our Belgravia townhouse was transformative. Their acoustic sheer drapes and hand-knotted Himalayan rugs brought an understated quiet luxury that defines our home.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    projectOrProduct: 'Belgravia Georgian Townhouse',
    isFeatured: true,
    isVisible: true,
    order: 1
  },
  {
    id: 'tst-02',
    clientName: 'Alistair Vance',
    clientRole: 'Principal Architect, Studio Vance & Partners',
    location: 'Mayfair & Zurich',
    quote: 'The depth of textile provenance and custom loom weaving capability at Atelier is unmatched. When drafting specifications for 100m+ yachts or heritage estates, their mill sourcing is our first call.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    projectOrProduct: 'Monaco Superyacht Penthouse',
    isFeatured: true,
    isVisible: true,
    order: 2
  },
  {
    id: 'tst-03',
    clientName: 'Devika Singhania',
    clientRole: 'Interior Designer & Heritage Restorer',
    location: 'Altamount Road, Mumbai',
    quote: 'From custom gold-threaded damasks from Venice to enzyme-washed Belgian flax, Atelier Living brings a sensory depth to spatial interiors that no standard distributor can rival.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    projectOrProduct: 'Malabar Hill Ocean Villa',
    isFeatured: true,
    isVisible: true,
    order: 3
  },
  {
    id: 'tst-04',
    clientName: 'Jean-Luc Moreau',
    clientRole: 'Senior Curator & Hospitality Consultant',
    location: 'Saint-Germain-des-Prés, Paris',
    quote: 'Their tactile swatches arrived in signature lacquer presentation boxes within 48 hours. The physical material physics match their 3D simulation with absolute perfection.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    projectOrProduct: 'Hôtel Particulier Le Marais',
    isFeatured: true,
    isVisible: true,
    order: 4
  }
];

export const fetchTestimonialsFromSupabase = async (): Promise<Testimonial[]> => {
  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: Testimonial[] = data.map((t) => ({
          id: t.id,
          clientName: t.client_name || t.clientName || 'Anonymous Collector',
          clientRole: t.client_role || t.clientRole || '',
          location: t.location || '',
          quote: t.quote || '',
          rating: Number(t.rating || 5),
          avatar: t.avatar || '',
          projectOrProduct: t.project_or_product || t.projectOrProduct || '',
          order: Number(t.order || 1),
          isFeatured: t.is_featured !== undefined ? t.is_featured : true,
          isVisible: t.is_visible !== undefined ? t.is_visible : true,
          createdAt: t.created_at
        }));
        localStorage.setItem('atelier_testimonials', JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch testimonials error:', err);
    }
  }

  // 2. Try LocalStorage
  try {
    const cached = localStorage.getItem('atelier_testimonials');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('LocalStorage testimonials load error:', e);
  }

  // 3. Fallback
  return DEFAULT_TESTIMONIALS;
};

export const saveTestimonialInSupabase = async (
  item: Testimonial,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  // 1. LocalStorage
  try {
    const list = await fetchTestimonialsFromSupabase();
    const idx = list.findIndex((t) => t.id === item.id);
    let updated: Testimonial[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = item;
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem('atelier_testimonials', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage testimonial save error:', e);
  }

  // 2. Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from('testimonials').upsert({
        id: item.id,
        client_name: item.clientName,
        client_role: item.clientRole,
        location: item.location,
        quote: item.quote,
        rating: item.rating,
        avatar: item.avatar,
        project_or_product: item.projectOrProduct,
        order: item.order || 1,
        is_featured: item.isFeatured !== false,
        is_visible: item.isVisible !== false,
        updated_at: new Date().toISOString()
      });

      await logAdminActivityInSupabase(
        adminEmail,
        'TESTIMONIAL_SAVED',
        `Saved review from ${item.clientName} (${item.location})`
      );
    } catch (err) {
      console.warn('Supabase testimonial upsert error:', err);
    }
  }

  return true;
};

export const deleteTestimonialInSupabase = async (
  testimonialId: string,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  try {
    const list = await fetchTestimonialsFromSupabase();
    const updated = list.filter((t) => t.id !== testimonialId);
    localStorage.setItem('atelier_testimonials', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage testimonial delete error:', e);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('testimonials').delete().eq('id', testimonialId);
      await logAdminActivityInSupabase(
        adminEmail,
        'TESTIMONIAL_DELETED',
        `Deleted review ${testimonialId}`
      );
    } catch (err) {
      console.warn('Supabase testimonial delete error:', err);
    }
  }

  return true;
};

// =======================================================
// 13. DYNAMIC GLOBAL BRAND PARTNERS & MARQUEE CMS
// =======================================================

export const DEFAULT_BRANDS_DATA: BrandPartner[] = BRANDS_DATA.map((b, idx) => ({
  ...b,
  order: idx + 1,
  isVisible: true,
  websiteUrl: ''
}));

export const fetchBrandsFromSupabase = async (): Promise<BrandPartner[]> => {
  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('brand_partners')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: BrandPartner[] = data.map((b) => ({
          id: b.id,
          name: b.name,
          country: b.country || '',
          established: b.established || '',
          tagline: b.tagline || '',
          description: b.description || '',
          logoText: b.logo_text || b.logoText || b.name,
          image: b.image || '',
          specialty: b.specialty || '',
          featuredProducts: Array.isArray(b.featured_products) ? b.featured_products : [],
          websiteUrl: b.website_url || b.websiteUrl || '',
          isVisible: b.is_visible !== undefined ? b.is_visible : true,
          order: Number(b.order || 1)
        }));
        localStorage.setItem('atelier_brands_data', JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch brands error:', err);
    }
  }

  // 2. Try LocalStorage
  try {
    const cached = localStorage.getItem('atelier_brands_data');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('LocalStorage brands load error:', e);
  }

  // 3. Fallback
  return DEFAULT_BRANDS_DATA;
};

export const saveBrandInSupabase = async (
  brand: BrandPartner,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  // 1. LocalStorage
  try {
    const list = await fetchBrandsFromSupabase();
    const idx = list.findIndex((b) => b.id === brand.id);
    let updated: BrandPartner[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = brand;
    } else {
      updated = [...list, brand];
    }
    localStorage.setItem('atelier_brands_data', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage brand save error:', e);
  }

  // 2. Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from('brand_partners').upsert({
        id: brand.id,
        name: brand.name,
        country: brand.country,
        established: brand.established,
        tagline: brand.tagline,
        description: brand.description,
        logo_text: brand.logoText,
        image: brand.image,
        specialty: brand.specialty,
        featured_products: brand.featuredProducts || [],
        website_url: brand.websiteUrl || '',
        is_visible: brand.isVisible !== false,
        order: brand.order || 1,
        updated_at: new Date().toISOString()
      });

      await logAdminActivityInSupabase(
        adminEmail,
        'BRAND_SAVED',
        `Saved brand partner ${brand.name} (${brand.country})`
      );
    } catch (err) {
      console.warn('Supabase brand upsert error:', err);
    }
  }

  return true;
};

export const deleteBrandInSupabase = async (
  brandId: string,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  try {
    const list = await fetchBrandsFromSupabase();
    const updated = list.filter((b) => b.id !== brandId);
    localStorage.setItem('atelier_brands_data', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage brand delete error:', e);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('brand_partners').delete().eq('id', brandId);
      await logAdminActivityInSupabase(
        adminEmail,
        'BRAND_DELETED',
        `Deleted brand partner ${brandId}`
      );
    } catch (err) {
      console.warn('Supabase brand delete error:', err);
    }
  }

  return true;
};

// =======================================================
// 14. DYNAMIC OUR STORY & HERITAGE CMS
// =======================================================

export const DEFAULT_STORY_SETTINGS: StorySettings = {
  heroBadge: 'Our Heritage & Craftsmanship',
  heroHeading: 'A Century of Tactile Mastery & Spatial Poetry',
  heroTitle: 'A Century of Tactile Mastery & Spatial Poetry',
  heroSubheading:
    'For over 120 years, Atelier Living has stood at the intersection of artisanal weaving traditions and modern architectural living. We believe that true interior luxury is defined by materials that honor the senses and endure across generations.',
  heroSubtitle: 'Woven for Generations • Designed to Endure',
  heroDescription:
    'For over 120 years, Atelier Living has stood at the intersection of artisanal weaving traditions and modern architectural living.',
  heroYear: 'EST. 1898',
  heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',

  ethosBadge: 'The Founder’s Ethos',
  founderBadge: 'The Founder’s Ethos',
  ethosQuote: 'We do not decorate rooms. We curate light, acoustic serenity, and human touch.',
  founderHeadline: '"We do not decorate rooms. We curate light, acoustic serenity, and human touch."',
  founderQuote:
    'Founded in Mayfair in 1898, our atelier began as a private commission house for discerning collectors seeking unyielding textile perfection. Today, under the creative direction of Julian & Beatrice Drape, we continue to preserve centuries-old European weaving techniques while engineering modern sustainable textiles.',
  ethosAuthor: 'Lady Vivienne Sterling',
  founderSignatory: 'Lady Vivienne Sterling',
  ethosRole: 'Founder & Master Curator',
  founderRole: 'Fourth-Generation Managing Director',
  ethosDescription1:
    'Founded in Mayfair in 1898, our atelier began as a private commission house for discerning collectors seeking unyielding textile perfection.',
  ethosDescription2:
    'Every thread has memory. Every drape defines acoustic presence. We craft tactile atmospheres for the world’s most inspired sanctuaries.',
  founderDescription:
    'Every thread has memory. Every drape defines acoustic presence. We craft tactile atmospheres for the world’s most inspired sanctuaries.',
  ethosImage:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  founderImage:
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',

  pillarsBadge: 'Material Integrity',
  pillarsTitle: 'Four Cornerstones of Our Sourcing',
  pillarsSubtitle: 'Direct alliances with historic mill houses and master artisans across the globe.',
  pillars: [
    {
      id: 'plr-1',
      title: 'Flanders Organic Flax',
      origin: 'Kortrijk, Belgium',
      description:
        'Grown without pesticides in rich river silt, our flax is enzyme-washed to achieve a fluid architectural drape.',
      icon: 'Feather',
      iconName: 'Feather',
      order: 1
    },
    {
      id: 'plr-2',
      title: 'Como Raw Silk Jacquard',
      origin: 'Lake Como, Italy',
      description:
        'Woven on slow shuttle looms that preserve yarn elasticity, resulting in luminous depth under changing daylight.',
      icon: 'Sparkles',
      iconName: 'Sparkles',
      order: 2
    },
    {
      id: 'plr-3',
      title: 'Florentine Mohair Velvet',
      origin: 'Florence, Italy',
      description:
        'Dyed in small artisan kettles using natural pigments, producing a dense pile that ages with an extraordinary patina.',
      icon: 'Compass',
      iconName: 'Compass',
      order: 3
    },
    {
      id: 'plr-4',
      title: 'Himalayan Hand-Knotted Silk',
      origin: 'Kathmandu, Nepal',
      description:
        'Crafted at 150 knots per square inch using hand-carded high-altitude wool and wild mulberry silk.',
      icon: 'HeartHandshake',
      iconName: 'HeartHandshake',
      order: 4
    }
  ],

  timelineBadge: 'Chronology of Excellence',
  timelineTitle: 'Our Historic Milestones',
  timelineSubtitle: 'A legacy of continuous innovation and artisan stewardship spanning three centuries.',
  milestones: [
    {
      id: 'mls-1',
      year: '1898',
      title: 'Foundation in Mayfair',
      description:
        'Master weaver Henri Drape established a small silk drapery atelier servicing London and Parisian aristocracy.',
      location: 'London & Paris',
      order: 1
    },
    {
      id: 'mls-2',
      year: '1948',
      title: 'Expansion into Como Silk Looms',
      description:
        'Acquired exclusive historical jacquard weaving looms along Lake Como, establishing custom silk pattern archives.',
      location: 'Lake Como, Italy',
      order: 2
    },
    {
      id: 'mls-3',
      year: '1985',
      title: 'Flax & Mohair Sourcing Alliance',
      description:
        'Pioneered direct organic flax farming partnerships with Kortrijk farmers in Belgium and Angora mohair mills in Florence.',
      location: 'Belgium & Italy',
      order: 3
    },
    {
      id: 'mls-4',
      year: '2012',
      title: 'Acoustic Sheer Innovation',
      description:
        'Engineered micro-flax acoustic sheer weaves in St. Gallen, combining sound absorption with transparent light diffusion.',
      location: 'St. Gallen, Switzerland',
      order: 4
    },
    {
      id: 'mls-5',
      year: '2026',
      title: 'The 3D Atelier Digital Studio',
      description:
        'Launched real-time material simulation enabling interior architects to inspect drape physics and custom colorways remotely.',
      location: 'Global Ateliers',
      order: 5
    }
  ],

  galleryBadge: 'Inside The Atelier',
  galleryTitle: 'Workshop & Loom Craft Gallery',
  gallerySubtitle: 'Behind the scenes at our European weaveries, dye kettles, and master carving workshops.',
  gallery: [
    {
      id: 'gal-1',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      caption: 'Artisanal Jacquard Shuttle Loom in Como, Italy',
      category: 'Weaving Mill',
      order: 1
    },
    {
      id: 'gal-2',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hand-sorting Flanders Flax Fibers in Kortrijk',
      category: 'Flax Preparation',
      order: 2
    },
    {
      id: 'gal-3',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
      caption: 'Kettle-Dyeing Mohair Velvet in Florence',
      category: 'Artisan Dyeing',
      order: 3
    },
    {
      id: 'gal-4',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85',
      caption: 'Master Weaver Hand-Carving Relief Rug Contours in Nepal',
      category: 'Relief Carving',
      order: 4
    }
  ],

  stats: [
    {
      value: '1898',
      label: 'Founding Year',
      description: 'Over a century of continuous artisan lineage'
    },
    {
      value: '8 Archives',
      label: 'Mill Houses',
      description: 'Exclusive heritage weaving alliances across Europe'
    },
    {
      value: '15,000+',
      label: 'Bespoke Meters',
      description: 'Woven annually for global private residences'
    },
    {
      value: '1,200+',
      label: 'Private Estates',
      description: 'Furnished across London, Paris, New York & Tokyo'
    }
  ],

  statsLegacy: '1898',
  statsArchives: '8 Archives',
  statsSwatches: '15,000+',
  statsResidences: '1,200+'
};

export const fetchStorySettingsFromSupabase = async (): Promise<StorySettings> => {
  // 1. Try Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('story_settings')
        .select('*')
        .eq('id', 'global-story')
        .maybeSingle();

      if (!error && data) {
        const mapped: StorySettings = {
          heroBadge: data.hero_badge || DEFAULT_STORY_SETTINGS.heroBadge,
          heroHeading: data.hero_heading || data.hero_title || DEFAULT_STORY_SETTINGS.heroHeading,
          heroTitle: data.hero_title || DEFAULT_STORY_SETTINGS.heroTitle,
          heroSubheading: data.hero_subheading || data.hero_subtitle || DEFAULT_STORY_SETTINGS.heroSubheading,
          heroSubtitle: data.hero_subtitle || DEFAULT_STORY_SETTINGS.heroSubtitle,
          heroDescription: data.hero_description || DEFAULT_STORY_SETTINGS.heroDescription,
          heroYear: data.hero_year || DEFAULT_STORY_SETTINGS.heroYear,
          heroImage: data.hero_image || DEFAULT_STORY_SETTINGS.heroImage,

          ethosBadge: data.ethos_badge || data.founder_badge || DEFAULT_STORY_SETTINGS.ethosBadge,
          founderBadge: data.founder_badge || DEFAULT_STORY_SETTINGS.founderBadge,
          ethosQuote: data.ethos_quote || data.founder_headline || data.founder_quote || DEFAULT_STORY_SETTINGS.ethosQuote,
          founderHeadline: data.founder_headline || DEFAULT_STORY_SETTINGS.founderHeadline,
          founderQuote: data.founder_quote || DEFAULT_STORY_SETTINGS.founderQuote,
          ethosAuthor: data.ethos_author || data.founder_signatory || DEFAULT_STORY_SETTINGS.ethosAuthor,
          founderSignatory: data.founder_signatory || DEFAULT_STORY_SETTINGS.founderSignatory,
          ethosRole: data.ethos_role || data.founder_role || DEFAULT_STORY_SETTINGS.ethosRole,
          founderRole: data.founder_role || DEFAULT_STORY_SETTINGS.founderRole,
          ethosDescription1: data.ethos_description1 || data.founder_description || DEFAULT_STORY_SETTINGS.ethosDescription1,
          ethosDescription2: data.ethos_description2 || DEFAULT_STORY_SETTINGS.ethosDescription2,
          founderDescription: data.founder_description || DEFAULT_STORY_SETTINGS.founderDescription,
          ethosImage: data.ethos_image || data.founder_image || DEFAULT_STORY_SETTINGS.ethosImage,
          founderImage: data.founder_image || DEFAULT_STORY_SETTINGS.founderImage,

          pillarsBadge: data.pillars_badge || DEFAULT_STORY_SETTINGS.pillarsBadge,
          pillarsTitle: data.pillars_title || DEFAULT_STORY_SETTINGS.pillarsTitle,
          pillarsSubtitle: data.pillars_subtitle || DEFAULT_STORY_SETTINGS.pillarsSubtitle,
          pillars: Array.isArray(data.pillars) && data.pillars.length > 0 ? data.pillars : DEFAULT_STORY_SETTINGS.pillars,

          timelineBadge: data.timeline_badge || DEFAULT_STORY_SETTINGS.timelineBadge,
          timelineTitle: data.timeline_title || DEFAULT_STORY_SETTINGS.timelineTitle,
          timelineSubtitle: data.timeline_subtitle || DEFAULT_STORY_SETTINGS.timelineSubtitle,
          milestones:
            Array.isArray(data.milestones) && data.milestones.length > 0
              ? data.milestones
              : Array.isArray(data.timeline_milestones) && data.timeline_milestones.length > 0
              ? data.timeline_milestones
              : DEFAULT_STORY_SETTINGS.milestones,

          galleryBadge: data.gallery_badge || DEFAULT_STORY_SETTINGS.galleryBadge,
          galleryTitle: data.gallery_title || DEFAULT_STORY_SETTINGS.galleryTitle,
          gallerySubtitle: data.gallery_subtitle || DEFAULT_STORY_SETTINGS.gallerySubtitle,
          gallery:
            Array.isArray(data.gallery) && data.gallery.length > 0
              ? data.gallery
              : Array.isArray(data.gallery_images) && data.gallery_images.length > 0
              ? data.gallery_images.map((img: any) => ({
                  image: img.image || img.url || '',
                  caption: img.caption || '',
                  category: img.category || 'Atelier'
                }))
              : DEFAULT_STORY_SETTINGS.gallery,

          stats:
            Array.isArray(data.stats) && data.stats.length > 0
              ? data.stats
              : DEFAULT_STORY_SETTINGS.stats,
          statsLegacy: data.stats_legacy || DEFAULT_STORY_SETTINGS.statsLegacy,
          statsArchives: data.stats_archives || DEFAULT_STORY_SETTINGS.statsArchives,
          statsSwatches: data.stats_swatches || DEFAULT_STORY_SETTINGS.statsSwatches,
          statsResidences: data.stats_residences || DEFAULT_STORY_SETTINGS.statsResidences,
          updatedAt: data.updated_at
        };
        localStorage.setItem('atelier_story_settings', JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch story settings error:', err);
    }
  }

  // 2. Try LocalStorage
  try {
    const cached = localStorage.getItem('atelier_story_settings');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('LocalStorage story settings load error:', e);
  }

  // 3. Fallback
  return DEFAULT_STORY_SETTINGS;
};

export const updateStorySettingsInSupabase = async (
  settings: StorySettings,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  // 1. LocalStorage
  try {
    localStorage.setItem('atelier_story_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage story settings save error:', e);
  }

  // 2. Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from('story_settings').upsert({
        id: 'global-story',
        hero_badge: settings.heroBadge,
        hero_heading: settings.heroHeading,
        hero_title: settings.heroHeading || settings.heroTitle,
        hero_subheading: settings.heroSubheading,
        hero_subtitle: settings.heroSubheading || settings.heroSubtitle,
        hero_description: settings.heroDescription || settings.heroSubheading,
        hero_year: settings.heroYear,
        hero_image: settings.heroImage,
        ethos_badge: settings.ethosBadge,
        founder_badge: settings.ethosBadge,
        ethos_quote: settings.ethosQuote,
        founder_headline: settings.ethosQuote,
        founder_quote: settings.ethosQuote,
        ethos_author: settings.ethosAuthor,
        founder_signatory: settings.ethosAuthor,
        ethos_role: settings.ethosRole,
        founder_role: settings.ethosRole,
        ethos_description1: settings.ethosDescription1,
        ethos_description2: settings.ethosDescription2,
        founder_description: settings.ethosDescription1,
        ethos_image: settings.ethosImage,
        founder_image: settings.ethosImage,
        pillars_badge: settings.pillarsBadge,
        pillars_title: settings.pillarsTitle,
        pillars_subtitle: settings.pillarsSubtitle,
        pillars: settings.pillars,
        timeline_badge: settings.timelineBadge,
        timeline_title: settings.timelineTitle,
        timeline_subtitle: settings.timelineSubtitle,
        milestones: settings.milestones,
        gallery_badge: settings.galleryBadge,
        gallery_title: settings.galleryTitle,
        gallery_subtitle: settings.gallerySubtitle,
        gallery: settings.gallery,
        stats: settings.stats,
        stats_legacy: settings.statsLegacy,
        stats_archives: settings.statsArchives,
        stats_swatches: settings.statsSwatches,
        stats_residences: settings.statsResidences,
        updated_at: new Date().toISOString()
      });

      await logAdminActivityInSupabase(
        adminEmail,
        'STORY_SETTINGS_UPDATED',
        'Updated Our Story & Heritage page content'
      );
    } catch (err) {
      console.warn('Supabase story settings upsert error:', err);
    }
  }

  return true;
};

// ==========================================
// HOMEPAGE HERO SHOWCASE SLIDER CMS
// ==========================================

export const DEFAULT_HERO_SLIDES: FurnishingScene[] = [
  {
    id: 'belgravia',
    title: 'Belgravia Grand Salon',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    tagline: 'Floor-to-ceiling acoustic linen drapes paired with hand-knotted silk rugs.',
    order: 1,
    isVisible: true,
    hotspots: [
      {
        id: 'hs-belgravia-1',
        x: 28,
        y: 35,
        label: 'Acoustic Sheer Drapes',
        detail: 'Fluid Belgian flax with 82% ambient sound attenuation.',
        origin: 'Kortrijk, Belgium'
      },
      {
        id: 'hs-belgravia-2',
        x: 62,
        y: 60,
        label: 'Tailored Mohair Lounge',
        detail: 'Hand-dyed Florentine mohair velvet with 100,000 Martindale durability.',
        origin: 'Florence, Italy'
      },
      {
        id: 'hs-belgravia-3',
        x: 48,
        y: 82,
        label: 'Botanical Relief Rug',
        detail: 'Hand-knotted Himalayan wool & mulberry silk at 150 knots/sq.in.',
        origin: 'Kathmandu, Nepal'
      }
    ]
  },
  {
    id: 'como',
    title: 'Como Lakefront Villa',
    location: 'Lombardy, Italy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    tagline: 'Light-responsive woven timber shades & raw Como silk window treatments.',
    order: 2,
    isVisible: true,
    hotspots: [
      {
        id: 'hs-como-1',
        x: 35,
        y: 30,
        label: 'Architectural Timber Shade',
        detail: 'Precision basswood slats woven with metallic copper filaments.',
        origin: 'Kyoto, Japan'
      },
      {
        id: 'hs-como-2',
        x: 70,
        y: 52,
        label: 'Como Spun Silk Panels',
        detail: 'Lustrous raw silk woven on 19th-century jacquard looms.',
        origin: 'Como, Italy'
      }
    ]
  },
  {
    id: 'mayfair',
    title: 'Mayfair Penthouse Suite',
    location: 'Mayfair, London',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85',
    tagline: 'Padded silk-cashmere headboards & 1000-thread-count Giza cotton percale.',
    order: 3,
    isVisible: true,
    hotspots: [
      {
        id: 'hs-mayfair-1',
        x: 50,
        y: 45,
        label: 'Quilted Cashmere Headboard',
        detail: 'Hand-tufted silk & cashmere topper with brass nailhead trim.',
        origin: 'Milan, Italy'
      },
      {
        id: 'hs-mayfair-2',
        x: 25,
        y: 70,
        label: 'Percale Bedding Suite',
        detail: 'Giza 45 extra-long staple Egyptian cotton with hand-hemstitched borders.',
        origin: 'Tuscany, Italy'
      }
    ]
  }
];

/**
 * Fetch Homepage Hero Slides from Supabase or LocalStorage
 */
export const fetchHeroSlidesFromSupabase = async (): Promise<FurnishingScene[]> => {
  const getDeletedHeroSlides = (): string[] => {
    try {
      const data = localStorage.getItem('atelier_deleted_hero_slides');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const deletedKeys = getDeletedHeroSlides();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data
          .map((item) => ({
            id: item.id,
            title: item.title,
            location: item.location || '',
            image: item.image || '',
            tagline: item.tagline || '',
            hotspots: Array.isArray(item.hotspots) ? item.hotspots : [],
            order: item.order ?? 1,
            isVisible: item.is_visible !== false
          }))
          .filter((s) => !deletedKeys.includes(s.id));
      }
    } catch (err) {
      console.warn('Error fetching hero slides from Supabase:', err);
    }
  }

  // 2. Fallback to LocalStorage
  try {
    const saved = localStorage.getItem('atelier_hero_slides');
    let list: FurnishingScene[] = DEFAULT_HERO_SLIDES;
    if (saved) {
      const parsed: FurnishingScene[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
    return list.filter((s) => !deletedKeys.includes(s.id));
  } catch {
    return DEFAULT_HERO_SLIDES.filter((s) => !deletedKeys.includes(s.id));
  }
};

/**
 * Save or update Homepage Hero Scene in Supabase & LocalStorage
 */
export const saveHeroSlideInSupabase = async (
  slide: FurnishingScene,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    const saved = localStorage.getItem('atelier_hero_slides');
    let list: FurnishingScene[] = saved ? JSON.parse(saved) : [...DEFAULT_HERO_SLIDES];
    const existingIndex = list.findIndex((s) => s.id === slide.id);
    if (existingIndex >= 0) {
      list[existingIndex] = slide;
    } else {
      list.push(slide);
    }
    localStorage.setItem('atelier_hero_slides', JSON.stringify(list));

    // Remove from deleted list if present
    const delData = localStorage.getItem('atelier_deleted_hero_slides');
    if (delData) {
      const delList: string[] = JSON.parse(delData);
      localStorage.setItem('atelier_deleted_hero_slides', JSON.stringify(delList.filter((id) => id !== slide.id)));
    }

    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage hero slide save error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('hero_slides').upsert({
        id: slide.id,
        title: slide.title,
        location: slide.location,
        image: slide.image,
        tagline: slide.tagline,
        hotspots: slide.hotspots,
        order: slide.order ?? 1,
        is_visible: slide.isVisible !== false,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.warn('Supabase hero_slides upsert error:', error);
      } else {
        await logAdminActivityInSupabase(
          adminEmail,
          'HERO_SLIDE_SAVED',
          `Saved homepage hero scene: ${slide.title} [${slide.id}]`
        );
      }
    } catch (err) {
      console.warn('Exception updating hero slide in Supabase:', err);
    }
  }

  return true;
};

/**
 * Delete Homepage Hero Scene in Supabase & LocalStorage
 */
export const deleteHeroSlideInSupabase = async (
  slideId: string,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  // 1. Sync to LocalStorage
  try {
    const delData = localStorage.getItem('atelier_deleted_hero_slides');
    const delList: string[] = delData ? JSON.parse(delData) : [];
    if (!delList.includes(slideId)) {
      delList.push(slideId);
      localStorage.setItem('atelier_deleted_hero_slides', JSON.stringify(delList));
    }

    const saved = localStorage.getItem('atelier_hero_slides');
    if (saved) {
      const parsed: FurnishingScene[] = JSON.parse(saved);
      const filtered = parsed.filter((s) => s.id !== slideId);
      localStorage.setItem('atelier_hero_slides', JSON.stringify(filtered));
    }

    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage hero slide delete error:', e);
  }

  // 2. Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', slideId);
      if (error) {
        console.warn('Supabase hero_slides delete error:', error);
      } else {
        await logAdminActivityInSupabase(
          adminEmail,
          'HERO_SLIDE_DELETED',
          `Deleted homepage hero scene ID: ${slideId}`
        );
      }
    } catch (err) {
      console.warn('Exception deleting hero slide in Supabase:', err);
    }
  }

  return true;
};

// =======================================================
// SEO & WEB MARKETING SUITE DATA & SUPABASE SYNC
// =======================================================

export const DEFAULT_PAGES_SEO: PageSEOConfig[] = [
  {
    pageId: 'home',
    pageName: 'Home Atmosphere Showcase',
    routePath: '/',
    metaTitle: 'Atelier Living | Haute Living, Bespoke Drapes & Luxury Furnishings',
    metaDescription: 'Discover Atelier Living: bespoke artisanal textiles, couture window treatments, bespoke drapes, wallcoverings, and European master craft furnishings.',
    keywords: 'luxury furnishings, bespoke curtains, couture textiles, acoustic drapes, interior atelier, high-end upholstery, luxury residence styling',
    canonicalUrl: 'https://atelier-living.com/',
    ogTitle: 'Atelier Living | Bespoke Haute Living & Furnishings',
    ogDescription: 'Curated European textiles, acoustic drapes, and bespoke interior furnishings for distinguished private residences.',
    ogImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Atelier Living | Bespoke Haute Living & Furnishings',
    twitterDescription: 'Curated European textiles, acoustic drapes, and bespoke interior furnishings for distinguished private residences.',
    twitterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    robotsIndex: true,
    robotsFollow: true,
    structuredDataJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HomeGoodsStore',
      'name': 'Atelier Living',
      'image': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'description': 'Haute interior furnishings, bespoke curtains, artisanal upholstery, and architectural drapery for luxury residences.',
      'url': 'https://atelier-living.com',
      'telephone': '+44 20 7946 0912',
      'priceRange': '$$$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '42 Grosvenor Crescent, Belgravia',
        'addressLocality': 'London',
        'postalCode': 'SW1X 7EE',
        'addressCountry': 'GB'
      }
    }, null, 2)
  },
  {
    pageId: 'story',
    pageName: 'Our Story & Craft Heritage',
    routePath: '/story',
    metaTitle: 'Our Story & European Mill Heritage | Atelier Living',
    metaDescription: 'Three decades of partnering with venerable European textile mills in Como, Flanders, Lyon, and Florence. Experience the art of bespoke fabrication.',
    keywords: 'textile heritage, Como silk weaving, Flanders linen, Belgian jacquard, Lyon velvet, bespoke curtain atelier',
    canonicalUrl: 'https://atelier-living.com/story',
    ogTitle: 'Our Story & Heritage | Atelier Living',
    ogDescription: 'Three decades of partnering with venerable European textile mills.',
    ogImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Our Story & Heritage | Atelier Living',
    twitterDescription: 'Three decades of partnering with venerable European textile mills.',
    twitterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    robotsIndex: true,
    robotsFollow: true,
    structuredDataJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'Our Story - Atelier Living',
      'description': 'History and craft heritage of Atelier Living and its master European textile partners.'
    }, null, 2)
  },
  {
    pageId: 'projects',
    pageName: 'Residence Portfolio',
    routePath: '/projects',
    metaTitle: 'Private Residences & Architectural Portfolio | Atelier Living',
    metaDescription: 'Explore completed residential commissions spanning Mayfair penthouses, Lake Como villas, Zurich chalets, and Beverly Hills estates.',
    keywords: 'luxury interior projects, penthouse drapery, villa furnishing portfolio, bespoke acoustic sheers, residence gallery',
    canonicalUrl: 'https://atelier-living.com/projects',
    ogTitle: 'Residence Portfolio | Atelier Living',
    ogDescription: 'Architectural drapery and bespoke furnishings in luxury private residences worldwide.',
    ogImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Residence Portfolio | Atelier Living',
    twitterDescription: 'Architectural drapery and bespoke furnishings in luxury private residences worldwide.',
    twitterImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    robotsIndex: true,
    robotsFollow: true
  },
  {
    pageId: 'catalogue',
    pageName: 'Product Catalogue & Haute Materials',
    routePath: '/category/fabrics',
    metaTitle: 'Haute Textiles, Wallcoverings & Luxury Rugs | Atelier Living',
    metaDescription: 'Browse the archival collection of bespoke fabrics, acoustic sheers, motorized drapery, natural wallcoverings, and hand-tufted silk rugs.',
    keywords: 'designer fabrics, acoustic drapery, luxury wallpaper, custom silk rugs, motorized blinds, wool bouclé',
    canonicalUrl: 'https://atelier-living.com/category/fabrics',
    ogTitle: 'Haute Textiles & Product Catalogue | Atelier Living',
    ogDescription: 'Archival collection of bespoke fabrics, acoustic drapery, wallcoverings, and hand-tufted rugs.',
    ogImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Haute Textiles & Product Catalogue | Atelier Living',
    twitterDescription: 'Archival collection of bespoke fabrics, acoustic drapery, wallcoverings, and hand-tufted rugs.',
    twitterImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    robotsIndex: true,
    robotsFollow: true
  },
  {
    pageId: 'brands',
    pageName: 'Partner Brands & European Mills',
    routePath: '/brands',
    metaTitle: 'Prestigious European Mill Partners | Atelier Living',
    metaDescription: 'Collaborations with heritage European textile powerhouses: Rubelli Venice, Loro Piana Interiors, Pierre Frey Paris, Dedar Milano, and Sahco.',
    keywords: 'Rubelli Venice, Loro Piana Interiors, Pierre Frey, Dedar Milano, Sahco, Zimmer Rohde, luxury fabric brands',
    canonicalUrl: 'https://atelier-living.com/brands',
    ogTitle: 'Prestigious European Mill Partners | Atelier Living',
    ogDescription: 'Collaborations with heritage European textile powerhouses and master weavers.',
    ogImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Prestigious European Mill Partners | Atelier Living',
    twitterDescription: 'Collaborations with heritage European textile powerhouses and master weavers.',
    twitterImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    robotsIndex: true,
    robotsFollow: true
  },
  {
    pageId: 'contact',
    pageName: 'Flagship Atelier & Private Consultations',
    routePath: '/contact',
    metaTitle: 'Private Client Consultations & Flagship Atelier | Atelier Living',
    metaDescription: 'Book a bespoke private curation consultation at our Belgravia Flagship Atelier or arrange a discreet residence walkthrough with our Senior Curators.',
    keywords: 'private interior consultation, Belgravia atelier appointment, swatch sampling request, bespoke drapery fitting',
    canonicalUrl: 'https://atelier-living.com/contact',
    ogTitle: 'Private Consultations & Contact | Atelier Living',
    ogDescription: 'Book a bespoke private consultation at our Belgravia Flagship Atelier.',
    ogImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Private Consultations & Contact | Atelier Living',
    twitterDescription: 'Book a bespoke private consultation at our Belgravia Flagship Atelier.',
    twitterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    robotsIndex: true,
    robotsFollow: true
  }
];

export const DEFAULT_MARKETING_SETTINGS: MarketingSettings = {
  id: 'default',
  webmaster: {
    googleSiteVerification: '',
    bingSiteVerification: '',
    yandexVerification: '',
    pinterestVerification: '',
    baiduVerification: '',
    customVerificationMeta: '',
    robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: https://atelier-living.com/sitemap.xml`,
    sitemapUrl: 'https://atelier-living.com/sitemap.xml'
  },
  pagesSEO: DEFAULT_PAGES_SEO,
  googleAnalytics: {
    enabled: false,
    type: 'ga4',
    measurementId: '',
    sendPageViewOnRouteChange: true,
    anonymizeIp: true
  },
  metaPixel: {
    enabled: false,
    pixelId: '',
    trackPageViewOnRouteChange: true,
    trackCustomEvents: true
  },
  codeInjection: {
    enabled: true,
    headerCode: '<!-- Custom Header Code & CSS Styles -->\n<style>\n  /* Atelier Custom Luxury Styling Hook */\n</style>',
    bodyOpenCode: '<!-- Custom Body Start Scripts -->',
    footerCode: '<!-- Custom Footer & Chat Widget Scripts -->'
  }
};

/**
 * Fetch Marketing, SEO, Analytics & Code Injection settings from Supabase (with LocalStorage fallback)
 */
export const fetchMarketingSettingsFromSupabase = async (): Promise<MarketingSettings> => {
  // 1. Try Supabase Cloud
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('marketing_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (data && !error) {
        const merged: MarketingSettings = {
          id: 'default',
          webmaster: {
            ...DEFAULT_MARKETING_SETTINGS.webmaster,
            ...(data.webmaster || {})
          },
          pagesSEO: data.pages_seo && Array.isArray(data.pages_seo) && data.pages_seo.length > 0
            ? data.pages_seo
            : DEFAULT_PAGES_SEO,
          googleAnalytics: {
            ...DEFAULT_MARKETING_SETTINGS.googleAnalytics,
            ...(data.google_analytics || {})
          },
          metaPixel: {
            ...DEFAULT_MARKETING_SETTINGS.metaPixel,
            ...(data.meta_pixel || {})
          },
          codeInjection: {
            ...DEFAULT_MARKETING_SETTINGS.codeInjection,
            ...(data.code_injection || {})
          },
          updatedAt: data.updated_at
        };

        // Cache in LocalStorage
        try {
          localStorage.setItem('atelier_marketing_settings', JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      }
    } catch (err) {
      console.warn('Supabase fetch marketing_settings error, using local fallback:', err);
    }
  }

  // 2. LocalStorage Fallback
  try {
    const saved = localStorage.getItem('atelier_marketing_settings');
    if (saved) {
      const parsed: Partial<MarketingSettings> = JSON.parse(saved);
      return {
        id: 'default',
        webmaster: { ...DEFAULT_MARKETING_SETTINGS.webmaster, ...(parsed.webmaster || {}) },
        pagesSEO: parsed.pagesSEO && Array.isArray(parsed.pagesSEO) && parsed.pagesSEO.length > 0
          ? parsed.pagesSEO
          : DEFAULT_PAGES_SEO,
        googleAnalytics: { ...DEFAULT_MARKETING_SETTINGS.googleAnalytics, ...(parsed.googleAnalytics || {}) },
        metaPixel: { ...DEFAULT_MARKETING_SETTINGS.metaPixel, ...(parsed.metaPixel || {}) },
        codeInjection: { ...DEFAULT_MARKETING_SETTINGS.codeInjection, ...(parsed.codeInjection || {}) },
        updatedAt: parsed.updatedAt
      };
    }
  } catch (e) {
    console.warn('LocalStorage marketing_settings parse error:', e);
  }

  return DEFAULT_MARKETING_SETTINGS;
};

/**
 * Save / Update Marketing & SEO Settings in Supabase and LocalStorage
 */
export const updateMarketingSettingsInSupabase = async (
  settings: MarketingSettings,
  adminEmail: string = 'admin@atelier-living.com'
): Promise<boolean> => {
  const updatedObj: MarketingSettings = {
    ...settings,
    id: 'default',
    updatedAt: new Date().toISOString()
  };

  // 1. Save to LocalStorage immediately and dispatch reactive storage event
  try {
    localStorage.setItem('atelier_marketing_settings', JSON.stringify(updatedObj));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage save marketing_settings error:', e);
  }

  // 2. Persist to Supabase Cloud
  if (isSupabaseConfigured) {
    try {
      const payload = {
        id: 'default',
        webmaster: updatedObj.webmaster,
        pages_seo: updatedObj.pagesSEO,
        google_analytics: updatedObj.googleAnalytics,
        meta_pixel: updatedObj.metaPixel,
        code_injection: updatedObj.codeInjection,
        updated_at: updatedObj.updatedAt
      };

      const { error } = await supabase
        .from('marketing_settings')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase upsert marketing_settings error:', error);
      } else {
        await logAdminActivityInSupabase(
          adminEmail,
          'MARKETING_SEO_SETTINGS_UPDATED',
          'Updated Webmaster, Page-wise SEO, Google Analytics, Meta Pixel, and Code Injection settings'
        );
      }
    } catch (err) {
      console.warn('Exception updating marketing_settings in Supabase:', err);
    }
  }

  return true;
};





