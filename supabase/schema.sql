-- =======================================================
-- MAISON & DRAPE - SUPABASE DATABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
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

-- Allow anyone to insert swatch requests (public storefront)
CREATE POLICY "Public insert swatch requests" ON public.swatch_requests
  FOR INSERT WITH CHECK (true);

-- Allow admins to read all swatch requests
CREATE POLICY "Admin select swatch requests" ON public.swatch_requests
  FOR SELECT USING (true);

-- Allow admins to update swatch requests status
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

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read products
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (true);

-- Admin insert/update products
CREATE POLICY "Admin modify products" ON public.products
  FOR ALL USING (true);

-- =======================================================
-- SEED DEMO SWATCH REQUESTS
-- =======================================================
INSERT INTO public.swatch_requests (client_name, email, phone, address, category_title, category_slug, swatches_requested, status)
VALUES 
  ('Lord Alistair Crawford', 'a.crawford@mayfair-estates.co.uk', '+44 20 7946 0912', '14 Grosvenor Square, Mayfair, London W1K 6LD', 'Bespoke Fabrics', 'fabrics', ARRAY['Como Raw Silk', 'Belgian Flanders Flax Linen'], 'Pending'),
  ('Madame Genevieve Laurent', 'g.laurent@laurent-interiors.fr', '+33 1 42 68 55 00', '28 Avenue Montaigne, 75008 Paris, France', 'Curtains & Upholstery', 'curtains-upholstery', ARRAY['Florentine Mohair Velvet', 'Acoustic Sheer Flax'], 'Dispatched')
ON CONFLICT DO NOTHING;
