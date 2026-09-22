-- =======================================================
-- ATELIER LIVING - SUPABASE DATABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/ywsmtfhzlhljeqetmvol/sql)
-- =======================================================

-- 1. Create Swatch Requests Table
CREATE TABLE IF NOT EXISTS public.swatch_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  category_title TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  swatches_requested TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Dispatched', 'Delivered', 'Archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.swatch_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Swatch Requests
DROP POLICY IF EXISTS "Public insert swatch requests" ON public.swatch_requests;
CREATE POLICY "Public insert swatch requests" ON public.swatch_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select swatch requests" ON public.swatch_requests;
CREATE POLICY "Admin select swatch requests" ON public.swatch_requests
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update swatch requests" ON public.swatch_requests;
CREATE POLICY "Admin update swatch requests" ON public.swatch_requests
  FOR UPDATE USING (true);

-- 2. Create Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  category_name TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  material_composition TEXT NOT NULL,
  width_or_dimensions TEXT,
  origin TEXT NOT NULL,
  price_category TEXT DEFAULT 'Bespoke',
  image TEXT NOT NULL,
  swatch_type TEXT DEFAULT 'linen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Products
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify products" ON public.products;
CREATE POLICY "Admin modify products" ON public.products
  FOR ALL USING (true);

-- 3. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'Master Curator',
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Admin Users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin select users" ON public.admin_users;
CREATE POLICY "Admin select users" ON public.admin_users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify users" ON public.admin_users;
CREATE POLICY "Admin modify users" ON public.admin_users
  FOR ALL USING (true);

-- 4. Create Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Audit Logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admin read audit logs" ON public.admin_audit_logs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admin insert audit logs" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (true);

-- 5. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_interest TEXT,
  project_scope TEXT,
  preferred_showroom TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Scheduled', 'Archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Contact Inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Public insert contact_inquiries" ON public.contact_inquiries
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin select contact_inquiries" ON public.contact_inquiries
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin modify contact_inquiries" ON public.contact_inquiries
  FOR ALL USING (true);

-- 6. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'Footer Gazette',
  status TEXT DEFAULT 'Subscribed' CHECK (status IN ('Subscribed', 'VIP Privé', 'Unsubscribed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public insert newsletter_subscribers" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin select newsletter_subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin modify newsletter_subscribers" ON public.newsletter_subscribers
  FOR ALL USING (true);

-- 7. Create Showrooms / Atelier Locations Table
CREATE TABLE IF NOT EXISTS public.showrooms (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  hours TEXT NOT NULL,
  image TEXT NOT NULL,
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  is_flagship BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Showrooms
ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select showrooms" ON public.showrooms;
CREATE POLICY "Public select showrooms" ON public.showrooms
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify showrooms" ON public.showrooms;
CREATE POLICY "Admin modify showrooms" ON public.showrooms
  FOR ALL USING (true);

-- 8. Create Global Contact Settings Table
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT DEFAULT 'Atelier Living Ltd',
  primary_phone TEXT DEFAULT '+44 (0)20 7946 0188',
  mobile_number TEXT DEFAULT '+44 7911 123456',
  whatsapp_number TEXT DEFAULT '+44 7911 123456',
  general_email TEXT DEFAULT 'concierge@atelier-living.com',
  vip_email TEXT DEFAULT 'vip@atelier-living.com',
  press_email TEXT DEFAULT 'press@atelier-living.com',
  trade_email TEXT DEFAULT 'trade@atelier-living.com',
  schedule_mon_fri TEXT DEFAULT '09:30 - 18:30',
  schedule_sat TEXT DEFAULT '10:00 - 17:00',
  schedule_sun TEXT DEFAULT 'By Private Appointment Only',
  schedule_holidays TEXT DEFAULT 'Closed on UK & EU Bank Holidays',
  instagram_url TEXT DEFAULT 'https://instagram.com/atelierliving',
  pinterest_url TEXT DEFAULT 'https://pinterest.com/atelierliving',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/company/atelier-living',
  youtube_url TEXT DEFAULT 'https://youtube.com/@atelierliving',
  twitter_url TEXT DEFAULT 'https://twitter.com/atelierliving',
  facebook_url TEXT DEFAULT 'https://facebook.com/atelierliving',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Contact Settings
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select contact_settings" ON public.contact_settings;
CREATE POLICY "Public select contact_settings" ON public.contact_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify contact_settings" ON public.contact_settings;
CREATE POLICY "Admin modify contact_settings" ON public.contact_settings
  FOR ALL USING (true);

-- 9. Create Projects / Portfolio Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  designer TEXT NOT NULL,
  products_used JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select projects" ON public.projects;
CREATE POLICY "Public select projects" ON public.projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify projects" ON public.projects;
CREATE POLICY "Admin modify projects" ON public.projects
  FOR ALL USING (true);

-- 10. Create Site Branding, Navigation & Global Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  header_logo_image TEXT DEFAULT '',
  header_logo_monogram TEXT DEFAULT 'A',
  header_logo_title TEXT DEFAULT 'Atelier Living',
  header_logo_subtitle TEXT DEFAULT 'Designed For Inspired Living',
  footer_logo_image TEXT DEFAULT '',
  footer_logo_monogram TEXT DEFAULT 'A',
  footer_logo_title TEXT DEFAULT 'Atelier Living',
  footer_description TEXT DEFAULT 'Atelier Living is an international interior design house crafting bespoke textiles, architectural drapes, structural upholstery, hand-knotted rugs, and limited-edition atelier artifacts for fine private residences, superyachts, and boutique luxury hotels.',
  footer_copyright TEXT DEFAULT '© 2026 Atelier Living Ltd. All rights reserved.',
  nav_links JSONB DEFAULT '[
    {"id": "home", "label": "Home", "target": "home", "isVisible": true, "order": 1},
    {"id": "story", "label": "Our Story", "target": "story", "isVisible": true, "order": 2},
    {"id": "catalogue", "label": "Product Catalogue", "target": "catalogue", "hasMegaMenu": true, "isVisible": true, "order": 3},
    {"id": "projects", "label": "Our Projects", "target": "projects", "isVisible": true, "order": 4},
    {"id": "brands", "label": "Brands With Us", "target": "brands", "isVisible": true, "order": 5},
    {"id": "contact", "label": "Contact Us", "target": "contact", "isVisible": true, "order": 6}
  ]'::jsonb,
  social_links JSONB DEFAULT '{
    "instagram": {"enabled": true, "url": "https://instagram.com/atelierliving", "label": "Instagram"},
    "pinterest": {"enabled": true, "url": "https://pinterest.com/atelierliving", "label": "Pinterest"},
    "linkedin": {"enabled": true, "url": "https://linkedin.com/company/atelier-living", "label": "LinkedIn"},
    "youtube": {"enabled": true, "url": "https://youtube.com/@atelierliving", "label": "YouTube"},
    "facebook": {"enabled": true, "url": "https://facebook.com/atelierliving", "label": "Facebook"},
    "twitter": {"enabled": false, "url": "https://twitter.com/atelierliving", "label": "X / Twitter"},
    "whatsapp": {"enabled": true, "url": "https://wa.me/447911123456", "label": "WhatsApp Concierge"}
  }'::jsonb,
  company_name TEXT DEFAULT 'Atelier Living Ltd',
  primary_phone TEXT DEFAULT '+44 (0)20 7946 0188',
  mobile_number TEXT DEFAULT '+44 7911 123456',
  whatsapp_number TEXT DEFAULT '+44 7911 123456',
  general_email TEXT DEFAULT 'concierge@atelier-living.com',
  vip_email TEXT DEFAULT 'vip@atelier-living.com',
  press_email TEXT DEFAULT 'press@atelier-living.com',
  trade_email TEXT DEFAULT 'trade@atelier-living.com',
  flagship_address TEXT DEFAULT '48 Berkeley Square, Mayfair, London W1J 5AW',
  schedule_mon_fri TEXT DEFAULT '09:30 - 18:30',
  schedule_sat TEXT DEFAULT '10:00 - 17:00',
  schedule_sun TEXT DEFAULT 'By Private Appointment Only',
  schedule_holidays TEXT DEFAULT 'Closed on UK & EU Bank Holidays',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select site_settings" ON public.site_settings;
CREATE POLICY "Public select site_settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin modify site_settings" ON public.site_settings;
CREATE POLICY "Admin modify site_settings" ON public.site_settings
  FOR ALL USING (true);

