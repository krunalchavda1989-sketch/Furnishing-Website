-- =======================================================
-- MAISON & DRAPE - SUPABASE DATABASE SCHEMA SETUP
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

