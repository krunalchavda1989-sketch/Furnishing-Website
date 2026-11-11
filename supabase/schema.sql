-- =======================================================
-- ATELIER LIVING / MAISON & DRAPE - SUPABASE DATABASE SCHEMA SETUP
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ywsmtfhzlhljeqetmvol/sql
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

ALTER TABLE public.swatch_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert swatch requests" ON public.swatch_requests;
CREATE POLICY "Public insert swatch requests" ON public.swatch_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin select swatch requests" ON public.swatch_requests;
CREATE POLICY "Admin select swatch requests" ON public.swatch_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin update swatch requests" ON public.swatch_requests;
CREATE POLICY "Admin update swatch requests" ON public.swatch_requests FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Admin delete swatch requests" ON public.swatch_requests;
CREATE POLICY "Admin delete swatch requests" ON public.swatch_requests FOR DELETE USING (true);

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify products" ON public.products;
CREATE POLICY "Admin modify products" ON public.products FOR ALL USING (true);

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

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin select users" ON public.admin_users;
CREATE POLICY "Admin select users" ON public.admin_users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify users" ON public.admin_users;
CREATE POLICY "Admin modify users" ON public.admin_users FOR ALL USING (true);

-- 4. Create Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin read audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admin read audit logs" ON public.admin_audit_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admin insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin delete audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admin delete audit logs" ON public.admin_audit_logs FOR DELETE USING (true);

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

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Public insert contact_inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin select contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin select contact_inquiries" ON public.contact_inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin modify contact_inquiries" ON public.contact_inquiries FOR ALL USING (true);

-- 6. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'Footer Gazette',
  status TEXT DEFAULT 'Subscribed' CHECK (status IN ('Subscribed', 'VIP Privé', 'Unsubscribed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public insert newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin select newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin select newsletter_subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin modify newsletter_subscribers" ON public.newsletter_subscribers FOR ALL USING (true);

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

ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select showrooms" ON public.showrooms;
CREATE POLICY "Public select showrooms" ON public.showrooms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify showrooms" ON public.showrooms;
CREATE POLICY "Admin modify showrooms" ON public.showrooms FOR ALL USING (true);

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

ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select contact_settings" ON public.contact_settings;
CREATE POLICY "Public select contact_settings" ON public.contact_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify contact_settings" ON public.contact_settings;
CREATE POLICY "Admin modify contact_settings" ON public.contact_settings FOR ALL USING (true);

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

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select projects" ON public.projects;
CREATE POLICY "Public select projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify projects" ON public.projects;
CREATE POLICY "Admin modify projects" ON public.projects FOR ALL USING (true);

-- 10. Create Site Branding, Navigation & Global Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  header_logo_image TEXT DEFAULT '',
  header_logo_monogram TEXT DEFAULT 'A',
  header_logo_title TEXT DEFAULT 'Atelier Living',
  header_logo_subtitle TEXT DEFAULT 'Designed For Inspired Living',
  header_font_size TEXT DEFAULT '13px',
  header_item_spacing TEXT DEFAULT '24px',
  header_font_weight TEXT DEFAULT '600',
  header_letter_spacing TEXT DEFAULT 'widest',
  header_text_transform TEXT DEFAULT 'uppercase',
  header_height TEXT DEFAULT 'standard',
  header_alignment TEXT DEFAULT 'center',
  header_logo_height INT DEFAULT 40,
  header_sticky BOOLEAN DEFAULT true,
  header_background_style TEXT DEFAULT 'emerald',
  header_border_bottom TEXT DEFAULT 'gold',
  header_top_bar_enabled BOOLEAN DEFAULT false,
  header_top_bar_text TEXT DEFAULT 'Complimentary Worldwide White-Glove Courier On Orders Over $1,000 | Private Showroom Consultations Available',
  header_top_bar_link TEXT DEFAULT 'contact',
  header_top_bar_bg TEXT DEFAULT 'gold',
  header_show_swatches_btn BOOLEAN DEFAULT true,
  header_show_search BOOLEAN DEFAULT true,
  header_show_concierge BOOLEAN DEFAULT true,
  header_show_cart BOOLEAN DEFAULT true,
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
  whatsapp_floating_enabled BOOLEAN DEFAULT true,
  whatsapp_floating_position TEXT DEFAULT 'bottom-right',
  whatsapp_floating_number TEXT DEFAULT '+44 7911 123456',
  whatsapp_floating_message TEXT DEFAULT 'Hello Atelier Living Concierge, I would like to inquire about bespoke furnishings.',
  whatsapp_floating_tooltip TEXT DEFAULT 'Chat with Concierge',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select site_settings" ON public.site_settings;
CREATE POLICY "Public select site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify site_settings" ON public.site_settings;
CREATE POLICY "Admin modify site_settings" ON public.site_settings FOR ALL USING (true);

-- 11. Create Client Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT DEFAULT '',
  location TEXT DEFAULT '',
  quote TEXT NOT NULL,
  rating NUMERIC DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar TEXT DEFAULT '',
  project_or_product TEXT DEFAULT '',
  "order" INT DEFAULT 1,
  is_featured BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select testimonials" ON public.testimonials;
CREATE POLICY "Public select testimonials" ON public.testimonials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify testimonials" ON public.testimonials;
CREATE POLICY "Admin modify testimonials" ON public.testimonials FOR ALL USING (true);

-- 12. Create Brand Partners Table
CREATE TABLE IF NOT EXISTS public.brand_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT DEFAULT '',
  established TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  logo_text TEXT NOT NULL,
  image TEXT DEFAULT '',
  specialty TEXT DEFAULT '',
  featured_products TEXT[] DEFAULT '{}',
  website_url TEXT DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  "order" INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brand_partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select brand_partners" ON public.brand_partners;
CREATE POLICY "Public select brand_partners" ON public.brand_partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify brand_partners" ON public.brand_partners;
CREATE POLICY "Admin modify brand_partners" ON public.brand_partners FOR ALL USING (true);

-- 13. Create Our Story & Heritage Settings Table
CREATE TABLE IF NOT EXISTS public.story_settings (
  id TEXT PRIMARY KEY DEFAULT 'global-story',
  hero_badge TEXT DEFAULT 'Our Heritage & Craftsmanship',
  hero_heading TEXT DEFAULT 'A Century of Tactile Mastery & Spatial Poetry',
  hero_title TEXT DEFAULT 'A Century of Tactile Mastery & Spatial Poetry',
  hero_subheading TEXT DEFAULT 'For over 120 years, Atelier Living has stood at the intersection of artisanal weaving traditions and modern architectural living.',
  hero_subtitle TEXT DEFAULT 'Woven for Generations • Designed to Endure',
  hero_description TEXT DEFAULT 'For over 120 years, Atelier Living has stood at the intersection of artisanal weaving traditions and modern architectural living.',
  hero_year TEXT DEFAULT 'EST. 1898',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
  ethos_badge TEXT DEFAULT 'The Founder’s Ethos',
  founder_badge TEXT DEFAULT 'The Founder’s Ethos',
  ethos_quote TEXT DEFAULT 'We do not decorate rooms. We curate light, acoustic serenity, and human touch.',
  founder_headline TEXT DEFAULT 'We do not decorate rooms. We curate light, acoustic serenity, and human touch.',
  founder_quote TEXT DEFAULT 'Founded in Mayfair in 1898, our atelier began as a private commission house for discerning collectors seeking unyielding textile perfection.',
  ethos_author TEXT DEFAULT 'Lady Vivienne Sterling',
  founder_signatory TEXT DEFAULT 'Lady Vivienne Sterling',
  ethos_role TEXT DEFAULT 'Founder & Master Curator',
  founder_role TEXT DEFAULT 'Fourth-Generation Managing Director',
  ethos_description1 TEXT DEFAULT 'Founded in Mayfair in 1898, our atelier began as a private commission house for discerning collectors seeking unyielding textile perfection.',
  ethos_description2 TEXT DEFAULT 'Every thread has memory. Every drape defines acoustic presence. We craft tactile atmospheres for the world’s most inspired sanctuaries.',
  founder_description TEXT DEFAULT 'Every thread has memory. Every drape defines acoustic presence.',
  ethos_image TEXT DEFAULT 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  founder_image TEXT DEFAULT 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  pillars_badge TEXT DEFAULT 'Material Integrity',
  pillars_title TEXT DEFAULT 'Four Cornerstones of Our Sourcing',
  pillars_subtitle TEXT DEFAULT 'Direct alliances with historic mill houses and master artisans across the globe.',
  pillars JSONB DEFAULT '[
    {"id": "plr-1", "title": "Flanders Organic Flax", "origin": "Kortrijk, Belgium", "description": "Grown without pesticides in rich river silt, our flax is enzyme-washed to achieve a fluid architectural drape.", "icon": "Feather", "iconName": "Feather", "order": 1},
    {"id": "plr-2", "title": "Como Raw Silk Jacquard", "origin": "Lake Como, Italy", "description": "Woven on slow shuttle looms that preserve yarn elasticity, resulting in luminous depth under changing daylight.", "icon": "Sparkles", "iconName": "Sparkles", "order": 2},
    {"id": "plr-3", "title": "Florentine Mohair Velvet", "origin": "Florence, Italy", "description": "Dyed in small artisan kettles using natural pigments, producing a dense pile that ages with an extraordinary patina.", "icon": "Compass", "iconName": "Compass", "order": 3},
    {"id": "plr-4", "title": "Himalayan Hand-Knotted Silk", "origin": "Kathmandu, Nepal", "description": "Crafted at 150 knots per square inch using hand-carded high-altitude wool and wild mulberry silk.", "icon": "HeartHandshake", "iconName": "HeartHandshake", "order": 4}
  ]'::jsonb,
  timeline_badge TEXT DEFAULT 'Chronology of Excellence',
  timeline_title TEXT DEFAULT 'Our Historic Milestones',
  timeline_subtitle TEXT DEFAULT 'A legacy of continuous innovation and artisan stewardship spanning three centuries.',
  milestones JSONB DEFAULT '[
    {"id": "mls-1", "year": "1898", "title": "Foundation in Mayfair", "description": "Master weaver Henri Drape established a small silk drapery atelier servicing London and Parisian aristocracy.", "location": "London & Paris", "order": 1},
    {"id": "mls-2", "year": "1948", "title": "Expansion into Como Silk Looms", "description": "Acquired exclusive historical jacquard weaving looms along Lake Como, establishing custom silk pattern archives.", "location": "Lake Como, Italy", "order": 2},
    {"id": "mls-3", "year": "1985", "title": "Flax & Mohair Sourcing Alliance", "description": "Pioneered direct organic flax farming partnerships with Kortrijk farmers in Belgium and Angora mohair mills in Florence.", "location": "Belgium & Italy", "order": 3},
    {"id": "mls-4", "year": "2012", "title": "Acoustic Sheer Innovation", "description": "Engineered micro-flax acoustic sheer weaves in St. Gallen, combining sound absorption with transparent light diffusion.", "location": "St. Gallen, Switzerland", "order": 4},
    {"id": "mls-5", "year": "2026", "title": "The 3D Atelier Digital Studio", "description": "Launched real-time material simulation enabling interior architects to inspect drape physics and custom colorways remotely.", "location": "Global Ateliers", "order": 5}
  ]'::jsonb,
  gallery_badge TEXT DEFAULT 'Inside The Atelier',
  gallery_title TEXT DEFAULT 'Workshop & Loom Craft Gallery',
  gallery_subtitle TEXT DEFAULT 'Behind the scenes at our European weaveries, dye kettles, and master carving workshops.',
  gallery JSONB DEFAULT '[
    {"id": "gal-1", "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85", "caption": "Artisanal Jacquard Shuttle Loom in Como, Italy", "category": "Weaving Mill", "order": 1},
    {"id": "gal-2", "image": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85", "caption": "Hand-sorting Flanders Flax Fibers in Kortrijk", "category": "Flax Preparation", "order": 2},
    {"id": "gal-3", "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85", "caption": "Kettle-Dyeing Mohair Velvet in Florence", "category": "Artisan Dyeing", "order": 3},
    {"id": "gal-4", "image": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85", "caption": "Master Weaver Hand-Carving Relief Rug Contours in Nepal", "category": "Relief Carving", "order": 4}
  ]'::jsonb,
  stats JSONB DEFAULT '[
    {"value": "1898", "label": "Founding Year", "description": "Over a century of continuous artisan lineage"},
    {"value": "8 Archives", "label": "Mill Houses", "description": "Exclusive heritage weaving alliances across Europe"},
    {"value": "15,000+", "label": "Bespoke Meters", "description": "Woven annually for global private residences"},
    {"value": "1,200+", "label": "Private Estates", "description": "Furnished across London, Paris, New York & Tokyo"}
  ]'::jsonb,
  stats_legacy TEXT DEFAULT '1898',
  stats_archives TEXT DEFAULT '8 Archives',
  stats_swatches TEXT DEFAULT '15,000+',
  stats_residences TEXT DEFAULT '1,200+',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.story_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select story_settings" ON public.story_settings;
CREATE POLICY "Public select story_settings" ON public.story_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify story_settings" ON public.story_settings;
CREATE POLICY "Admin modify story_settings" ON public.story_settings FOR ALL USING (true);

-- 14. Create Homepage Hero Showcase Slider Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  image TEXT NOT NULL,
  tagline TEXT NOT NULL,
  hotspots JSONB DEFAULT '[]'::jsonb,
  "order" INT DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select hero_slides" ON public.hero_slides;
CREATE POLICY "Public select hero_slides" ON public.hero_slides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify hero_slides" ON public.hero_slides;
CREATE POLICY "Admin modify hero_slides" ON public.hero_slides FOR ALL USING (true);

-- =======================================================
-- INITIAL DEFAULT SEED DATA INSERTION
-- =======================================================

-- Seed Site Settings
INSERT INTO public.site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- Seed Contact Settings
INSERT INTO public.contact_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- Seed Our Story Settings
INSERT INTO public.story_settings (id) VALUES ('global-story') ON CONFLICT (id) DO NOTHING;

-- Seed Homepage Hero Showcase Slides
INSERT INTO public.hero_slides (id, title, location, image, tagline, hotspots, "order", is_visible)
VALUES
(
  'belgravia',
  'Belgravia Grand Salon',
  'London, UK',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
  'Floor-to-ceiling acoustic linen drapes paired with hand-knotted silk rugs.',
  '[
    {"id": "hs-1", "x": 28, "y": 35, "label": "Acoustic Sheer Drapes", "detail": "Fluid Belgian flax with 82% ambient sound attenuation.", "origin": "Kortrijk, Belgium"},
    {"id": "hs-2", "x": 62, "y": 60, "label": "Tailored Mohair Lounge", "detail": "Hand-dyed Florentine mohair velvet with 100,000 Martindale durability.", "origin": "Florence, Italy"},
    {"id": "hs-3", "x": 48, "y": 82, "label": "Botanical Relief Rug", "detail": "Hand-knotted Himalayan wool & mulberry silk at 150 knots/sq.in.", "origin": "Kathmandu, Nepal"}
  ]'::jsonb,
  1,
  true
),
(
  'como',
  'Como Lakefront Villa',
  'Lombardy, Italy',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
  'Light-responsive woven timber shades & raw Como silk window treatments.',
  '[
    {"id": "hs-4", "x": 35, "y": 30, "label": "Architectural Timber Shade", "detail": "Precision basswood slats woven with metallic copper filaments.", "origin": "Kyoto, Japan"},
    {"id": "hs-5", "x": 70, "y": 52, "label": "Como Spun Silk Panels", "detail": "Lustrous raw silk woven on 19th-century jacquard looms.", "origin": "Como, Italy"}
  ]'::jsonb,
  2,
  true
),
(
  'mayfair',
  'Mayfair Penthouse Suite',
  'Mayfair, London',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85',
  'Padded silk-cashmere headboards & 1000-thread-count Giza cotton percale.',
  '[
    {"id": "hs-6", "x": 50, "y": 45, "label": "Quilted Cashmere Headboard", "detail": "Hand-tufted silk & cashmere topper with brass nailhead trim.", "origin": "Milan, Italy"},
    {"id": "hs-7", "x": 25, "y": 70, "label": "Percale Bedding Suite", "detail": "Giza 45 extra-long staple Egyptian cotton with hand-hemstitched borders.", "origin": "Tuscany, Italy"}
  ]'::jsonb,
  3,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Seed Testimonials
INSERT INTO public.testimonials (id, client_name, client_role, location, quote, rating, avatar, project_or_product, "order", is_featured, is_visible)
VALUES
('tst-01', 'Lady Clarissa Montgomery', 'Private Collector & Architectural Patron', 'Belgravia Residence, London', 'Working with Atelier Living on our Belgravia townhouse was transformative. Their acoustic sheer drapes and hand-knotted Himalayan rugs brought an understated quiet luxury that defines our home.', 5, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Belgravia Georgian Townhouse', 1, true, true),
('tst-02', 'Alistair Vance', 'Principal Architect, Studio Vance & Partners', 'Mayfair & Zurich', 'The depth of textile provenance and custom loom weaving capability at Atelier is unmatched. When drafting specifications for 100m+ yachts or heritage estates, their mill sourcing is our first call.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Monaco Superyacht Penthouse', 2, true, true),
('tst-03', 'Devika Singhania', 'Interior Designer & Heritage Restorer', 'Altamount Road, Mumbai', 'From custom gold-threaded damasks from Venice to enzyme-washed Belgian flax, Atelier Living brings a sensory depth to spatial interiors that no standard distributor can rival.', 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Malabar Hill Ocean Villa', 3, true, true),
('tst-04', 'Jean-Luc Moreau', 'Senior Curator & Hospitality Consultant', 'Saint-Germain-des-Prés, Paris', 'Their tactile swatches arrived in signature lacquer presentation boxes within 48 hours. The physical material physics match their 3D simulation with absolute perfection.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Hôtel Particulier Le Marais', 4, true, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Brand Partners
INSERT INTO public.brand_partners (id, name, country, established, tagline, description, logo_text, image, specialty, website_url, is_visible, "order")
VALUES
('bnd-01', 'Tessitura D''Oro', 'Italy', '1892', 'Master Silk Weavers of Lake Como', 'Nestled in the historic textile quarter along Lake Como, Tessitura D''Oro combines ancestral jacquard loom craft with ultra-fine mulberry silk spinning.', 'TESSITURA D''ORO COMO', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80', 'Como Silk Damasks & Jacquards', 'https://tessituradoro.it', true, 1),
('bnd-02', 'Kortrijk Linens', 'Belgium', '1911', 'Artisanal Flanders River Basin Flax', 'Cultivating organic river flax in Kortrijk without synthetic pesticides, Kortrijk Linens produces extra-wide architectural drapery fabrics.', 'KORTRIJK LINEN FLANDERS', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80', 'Enzyme-Washed Belgian Flax', '', true, 2),
('bnd-03', 'Manifattura Fiorentina', 'Italy', '1934', 'Kettle-Dyed Florentine Velvets', 'Specializing in Angora mohair and high-density cotton velvets dyed in small heritage kettles using natural mineral pigments.', 'MANIFATTURA FIORENTINA', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', 'Deep-Pile Mohair Velvet', '', true, 3),
('bnd-04', 'St. Gallen Weavery', 'Switzerland', '1956', 'Micro-Engineered Acoustic Sheers', 'Combining centuries-old Swiss embroidery traditions with modern acoustic sound-absorption technology.', 'ST. GALLEN ATELIER', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80', 'Acoustic Sheer & Voiles', '', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Showrooms
INSERT INTO public.showrooms (id, city, country, address, phone, email, hours, image, lat, lng, is_flagship, notes)
VALUES
('mayfair', 'London Mayfair', 'United Kingdom', '48 Berkeley Square, Mayfair, London W1J 5AW', '+44 (0)20 7946 0188', 'london@atelier-living.com', 'Mon-Fri: 09:30-18:30 | Sat: 10:00-17:00 | Sun: By Appointment', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 51.509865, -0.144883, true, 'Global Head Flagship & Private Archive Gallery'),
('paris', 'Paris 8e', 'France', '14 Rue du Faubourg Saint-Honoré, 75008 Paris', '+33 (0)1 42 68 55 00', 'paris@atelier-living.com', 'Tue-Sat: 10:00-19:00 | Mon: By Appointment', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', 48.8698, 2.3211, true, 'European Commission & Textile Atelier'),
('ny', 'New York Madison Ave', 'United States', '740 Madison Avenue, Upper East Side, New York, NY 10065', '+1 (212) 555-0198', 'nyc@atelier-living.com', 'Mon-Sat: 10:00-18:00 | Sun: Closed', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', 40.7667, -73.9686, false, 'Americas Design Center & Trade Studio'),
('tokyo', 'Tokyo Ginza', 'Japan', '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061', '+81 (3) 5555-0142', 'tokyo@atelier-living.com', 'Tue-Sun: 11:00-19:30 | Mon: Closed', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', 35.6698, 139.764, false, 'Asia-Pacific Atelier & Woven Wood Studio')
ON CONFLICT (id) DO NOTHING;

-- Seed Projects Portfolio
INSERT INTO public.projects (id, title, category, location, year, hero_image, gallery, description, designer, products_used)
VALUES
('prj-01', 'Belgravia Georgian Townhouse', 'Private Residence', 'London, UK', '2025', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85'], 'A complete restoration of a Grade II listed Georgian drawing room and grand dining salon using custom raw silk drapery and hand-dyed mohair velvet upholstery.', 'Julian Drape & Beatrice Sterling', '[{"productName": "Aurelia Raw Silk Jacquard", "category": "fabrics", "notes": "Grand drawing room drapery"}]'::jsonb),
('prj-02', 'Villa d''Este Lakeside Pavilion', 'Heritage Estate', 'Lake Como, Italy', '2024', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'], 'Floor-to-ceiling sheer acoustic drapes and custom hand-knotted silk rugs for a private lakefront salon.', 'Studio Vance & Partners', '[{"productName": "Symphony Acoustic Linen Sheer", "category": "curtains-upholstery", "notes": "Sun-drenched salon"}]'::jsonb),
('prj-03', 'Tribeca Sky Penthouse', 'Modern Penthouse', 'New York, USA', '2026', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'], 'Curvilinear alpaca bouclé seating paired with motorized woven timber Roman shades throughout a 7,000 sq ft duplex.', 'Atelier Living Studio', '[{"productName": "Verona Sculpted Bouclé Upholstery", "category": "curtains-upholstery", "notes": "Curved sofa seating"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 15. Create Marketing, SEO, Analytics & Code Injection Table
CREATE TABLE IF NOT EXISTS public.marketing_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  webmaster JSONB DEFAULT '{
    "googleSiteVerification": "",
    "bingSiteVerification": "",
    "yandexVerification": "",
    "pinterestVerification": "",
    "baiduVerification": "",
    "customVerificationMeta": "",
    "robotsTxtContent": "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: https://atelier-living.com/sitemap.xml",
    "sitemapUrl": "https://atelier-living.com/sitemap.xml"
  }'::jsonb,
  pages_seo JSONB DEFAULT '[]'::jsonb,
  google_analytics JSONB DEFAULT '{
    "enabled": false,
    "type": "ga4",
    "measurementId": "",
    "sendPageViewOnRouteChange": true,
    "anonymizeIp": true
  }'::jsonb,
  meta_pixel JSONB DEFAULT '{
    "enabled": false,
    "pixelId": "",
    "trackPageViewOnRouteChange": true,
    "trackCustomEvents": true
  }'::jsonb,
  code_injection JSONB DEFAULT '{
    "enabled": true,
    "headerCode": "<!-- Custom Header Code & CSS Styles -->\n<style>\n  /* Atelier Custom Luxury Styling Hook */\n</style>",
    "bodyOpenCode": "<!-- Custom Body Start Scripts -->",
    "footerCode": "<!-- Custom Footer & Chat Widget Scripts -->"
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.marketing_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select marketing_settings" ON public.marketing_settings;
CREATE POLICY "Public select marketing_settings" ON public.marketing_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify marketing_settings" ON public.marketing_settings;
CREATE POLICY "Admin modify marketing_settings" ON public.marketing_settings FOR ALL USING (true);

-- Seed Default Marketing Settings
INSERT INTO public.marketing_settings (id, webmaster, pages_seo, google_analytics, meta_pixel, code_injection)
VALUES (
  'default',
  '{
    "googleSiteVerification": "",
    "bingSiteVerification": "",
    "yandexVerification": "",
    "pinterestVerification": "",
    "baiduVerification": "",
    "customVerificationMeta": "",
    "robotsTxtContent": "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: https://atelier-living.com/sitemap.xml",
    "sitemapUrl": "https://atelier-living.com/sitemap.xml"
  }'::jsonb,
  '[
    {
      "pageId": "home",
      "pageName": "Home Atmosphere Showcase",
      "routePath": "/",
      "metaTitle": "Atelier Living | Haute Living, Bespoke Drapes & Luxury Furnishings",
      "metaDescription": "Discover Atelier Living: bespoke artisanal textiles, couture window treatments, bespoke drapes, wallcoverings, and European master craft furnishings.",
      "keywords": "luxury furnishings, bespoke curtains, couture textiles, acoustic drapes, interior atelier, high-end upholstery, luxury residence styling",
      "canonicalUrl": "https://atelier-living.com/",
      "ogTitle": "Atelier Living | Bespoke Haute Living & Furnishings",
      "ogDescription": "Curated European textiles, acoustic drapes, and bespoke interior furnishings for distinguished private residences.",
      "ogImage": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "ogType": "website",
      "twitterCard": "summary_large_image",
      "twitterTitle": "Atelier Living | Bespoke Haute Living & Furnishings",
      "twitterDescription": "Curated European textiles, acoustic drapes, and bespoke interior furnishings for distinguished private residences.",
      "twitterImage": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "robotsIndex": true,
      "robotsFollow": true
    },
    {
      "pageId": "story",
      "pageName": "Our Story & Craft Heritage",
      "routePath": "/story",
      "metaTitle": "Our Story & European Mill Heritage | Atelier Living",
      "metaDescription": "Three decades of partnering with venerable European textile mills in Como, Flanders, Lyon, and Florence. Experience the art of bespoke fabrication.",
      "keywords": "textile heritage, Como silk weaving, Flanders linen, Belgian jacquard, Lyon velvet, bespoke curtain atelier",
      "canonicalUrl": "https://atelier-living.com/story",
      "ogTitle": "Our Story & Heritage | Atelier Living",
      "ogDescription": "Three decades of partnering with venerable European textile mills.",
      "ogImage": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "ogType": "article",
      "twitterCard": "summary_large_image",
      "twitterTitle": "Our Story & Heritage | Atelier Living",
      "twitterDescription": "Three decades of partnering with venerable European textile mills.",
      "twitterImage": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "robotsIndex": true,
      "robotsFollow": true
    },
    {
      "pageId": "projects",
      "pageName": "Residence Portfolio",
      "routePath": "/projects",
      "metaTitle": "Private Residences & Architectural Portfolio | Atelier Living",
      "metaDescription": "Explore completed residential commissions spanning Mayfair penthouses, Lake Como villas, Zurich chalets, and Beverly Hills estates.",
      "keywords": "luxury interior projects, penthouse drapery, villa furnishing portfolio, bespoke acoustic sheers, residence gallery",
      "canonicalUrl": "https://atelier-living.com/projects",
      "ogTitle": "Residence Portfolio | Atelier Living",
      "ogDescription": "Architectural drapery and bespoke furnishings in luxury private residences worldwide.",
      "ogImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "ogType": "website",
      "twitterCard": "summary_large_image",
      "twitterTitle": "Residence Portfolio | Atelier Living",
      "twitterDescription": "Architectural drapery and bespoke furnishings in luxury private residences worldwide.",
      "twitterImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "robotsIndex": true,
      "robotsFollow": true
    },
    {
      "pageId": "catalogue",
      "pageName": "Product Catalogue & Haute Materials",
      "routePath": "/category/fabrics",
      "metaTitle": "Haute Textiles, Wallcoverings & Luxury Rugs | Atelier Living",
      "metaDescription": "Browse the archival collection of bespoke fabrics, acoustic sheers, motorized drapery, natural wallcoverings, and hand-tufted silk rugs.",
      "keywords": "designer fabrics, acoustic drapery, luxury wallpaper, custom silk rugs, motorized blinds, wool bouclé",
      "canonicalUrl": "https://atelier-living.com/category/fabrics",
      "ogTitle": "Haute Textiles & Product Catalogue | Atelier Living",
      "ogDescription": "Archival collection of bespoke fabrics, acoustic drapery, wallcoverings, and hand-tufted rugs.",
      "ogImage": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "ogType": "website",
      "twitterCard": "summary_large_image",
      "twitterTitle": "Haute Textiles & Product Catalogue | Atelier Living",
      "twitterDescription": "Archival collection of bespoke fabrics, acoustic drapery, wallcoverings, and hand-tufted rugs.",
      "twitterImage": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "robotsIndex": true,
      "robotsFollow": true
    },
    {
      "pageId": "brands",
      "pageName": "Partner Brands & European Mills",
      "routePath": "/brands",
      "metaTitle": "Prestigious European Mill Partners | Atelier Living",
      "metaDescription": "Collaborations with heritage European textile powerhouses: Rubelli Venice, Loro Piana Interiors, Pierre Frey Paris, Dedar Milano, and Sahco.",
      "keywords": "Rubelli Venice, Loro Piana Interiors, Pierre Frey, Dedar Milano, Sahco, Zimmer Rohde, luxury fabric brands",
      "canonicalUrl": "https://atelier-living.com/brands",
      "ogTitle": "Prestigious European Mill Partners | Atelier Living",
      "ogDescription": "Collaborations with heritage European textile powerhouses and master weavers.",
      "ogImage": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "ogType": "website",
      "twitterCard": "summary_large_image",
      "twitterTitle": "Prestigious European Mill Partners | Atelier Living",
      "twitterDescription": "Collaborations with heritage European textile powerhouses and master weavers.",
      "twitterImage": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "robotsIndex": true,
      "robotsFollow": true
    },
    {
      "pageId": "contact",
      "pageName": "Flagship Atelier & Private Consultations",
      "routePath": "/contact",
      "metaTitle": "Private Client Consultations & Flagship Atelier | Atelier Living",
      "metaDescription": "Book a bespoke private curation consultation at our Belgravia Flagship Atelier or arrange a discreet residence walkthrough with our Senior Curators.",
      "keywords": "private interior consultation, Belgravia atelier appointment, swatch sampling request, bespoke drapery fitting",
      "canonicalUrl": "https://atelier-living.com/contact",
      "ogTitle": "Private Consultations & Contact | Atelier Living",
      "ogDescription": "Book a bespoke private consultation at our Belgravia Flagship Atelier.",
      "ogImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "ogType": "website",
      "twitterCard": "summary_large_image",
      "twitterTitle": "Private Consultations & Contact | Atelier Living",
      "twitterDescription": "Book a bespoke private consultation at our Belgravia Flagship Atelier.",
      "twitterImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "robotsIndex": true,
      "robotsFollow": true
    }
  ]'::jsonb,
  '{
    "enabled": false,
    "type": "ga4",
    "measurementId": "",
    "sendPageViewOnRouteChange": true,
    "anonymizeIp": true
  }'::jsonb,
  '{
    "enabled": false,
    "pixelId": "",
    "trackPageViewOnRouteChange": true,
    "trackCustomEvents": true
  }'::jsonb,
  '{
    "enabled": true,
    "headerCode": "<!-- Custom Header Code & CSS Styles -->\n<style>\n  /* Atelier Custom Luxury Styling Hook */\n</style>",
    "bodyOpenCode": "<!-- Custom Body Start Scripts -->",
    "footerCode": "<!-- Custom Footer & Chat Widget Scripts -->"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- =======================================================
-- 16. CREATE COLLECTIONS & CATEGORIES ARCHITECTURE TABLE
-- =======================================================
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT NOT NULL,
  hero_image TEXT,
  craft_origin TEXT DEFAULT 'Ahmedabad',
  material_highlight TEXT DEFAULT '',
  "order" INT DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select collections" ON public.collections;
CREATE POLICY "Public select collections" ON public.collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify collections" ON public.collections;
CREATE POLICY "Admin modify collections" ON public.collections FOR ALL USING (true);

-- Seed Core 6 Collections (Storefront Architecture)
INSERT INTO public.collections (id, slug, number, title, subtitle, description, hero_image, craft_origin, material_highlight, "order", is_visible)
VALUES
(
  'drapes-curtains',
  'drapes-curtains',
  '01',
  'Drapes & Curtains',
  'Architectural Window Treatments & Sheers',
  'Beautifully tailored window treatments that create the perfect balance of privacy, light and elegance. Explore sheer curtains, statement drapes, layered treatments and bespoke designs.',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85',
  'Ahmedabad & Como, Italy',
  'Acoustic Sheers, Belgian Linen & Pure Silk Drapes',
  1,
  true
),
(
  'upholstery-fabrics',
  'upholstery-fabrics',
  '02',
  'Upholstery & Fabrics',
  'Textured Bouclés, Mohair Velvets & Fine Weaves',
  'Discover an inspiring selection of textures, colours and fabrics designed to bring comfort, sophistication and personality to your furniture and interiors.',
  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1800&q=85',
  'Ahmedabad & Flanders, Belgium',
  'Flanders Flax Linen, Mohair Velvet & Bouclé',
  2,
  true
),
(
  'wallpapers-wallcoverings',
  'wallpapers-wallcoverings',
  '03',
  'Wallpapers & Wallcoverings',
  'Curated Wallcoverings & Textured Reliefs',
  'Create distinctive spaces with curated wallcoverings, from subtle textures and timeless patterns to expressive statement designs.',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
  'Ahmedabad & Lyons, France',
  'Hand-Painted Silk, Grasscloth & Metallic Reliefs',
  3,
  true
),
(
  'rugs-carpets',
  'rugs-carpets',
  '04',
  'Rugs & Carpets',
  'Hand-Knotted Floor Coverings & Broadloom',
  'Add warmth, texture and character to your interiors with rugs that complement your aesthetic and bring the entire space together.',
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1800&q=85',
  'Ahmedabad & Kathmandu, Nepal',
  'Himalayan Wool, Botanical Silk & Wilton Broadloom',
  4,
  true
),
(
  'mattresses-sleep-comfort',
  'mattresses-sleep-comfort',
  '05',
  'Mattresses & Sleep Comfort',
  'Ergonomic Support & Restorative Craftsmanship',
  'Experience comfort designed around the way you rest. Explore our mattress solutions, bringing together everyday support and thoughtful craftsmanship.',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85',
  'Ahmedabad & Milan, Italy',
  'Natural Latex, Pocket Springs & Pure Wool Quilting',
  5,
  true
),
(
  'custom-furnishing-solutions',
  'custom-furnishing-solutions',
  '06',
  'Custom Furnishing Solutions',
  'Concept-to-Finish Bespoke Design & Curation',
  'From concept to finishing touches, discover personalised furnishing solutions thoughtfully developed to suit your space, preferences and lifestyle.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
  'Ahmedabad Atelier',
  'Personalised Selections & Master Finishing Touches',
  6,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  hero_image = EXCLUDED.hero_image,
  craft_origin = EXCLUDED.craft_origin,
  material_highlight = EXCLUDED.material_highlight,
  "order" = EXCLUDED."order",
  is_visible = EXCLUDED.is_visible,
  updated_at = timezone('utc'::text, now());

-- ==========================================
-- 17. Create Atelier Experience Process Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.atelier_experience (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge TEXT NOT NULL DEFAULT 'THE ATELIER EXPERIENCE',
  heading_primary TEXT NOT NULL DEFAULT 'Your Vision.',
  heading_accent TEXT DEFAULT 'Our Craftsmanship.',
  intro_text TEXT NOT NULL DEFAULT 'We believe a beautifully furnished space begins with understanding you.',
  cta_label TEXT DEFAULT 'Begin Your Private Consultation',
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.atelier_experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select atelier_experience" ON public.atelier_experience;
CREATE POLICY "Public select atelier_experience" ON public.atelier_experience FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify atelier_experience" ON public.atelier_experience;
CREATE POLICY "Admin modify atelier_experience" ON public.atelier_experience FOR ALL USING (true);

INSERT INTO public.atelier_experience (
  id, badge, heading_primary, heading_accent, intro_text, cta_label, steps, is_visible
)
VALUES (
  'default',
  'THE ATELIER EXPERIENCE',
  'Your Vision.',
  'Our Craftsmanship.',
  'We believe a beautifully furnished space begins with understanding you.',
  'Begin Your Private Consultation',
  '[
    {
      "id": "step-discover",
      "number": "01",
      "title": "Discover",
      "description": "We begin by understanding your space, aesthetic preferences, lifestyle and furnishing requirements.",
      "isVisible": true,
      "order": 1
    },
    {
      "id": "step-curate",
      "number": "02",
      "title": "Curate",
      "description": "Explore carefully selected fabrics, textures, colours and materials tailored to your vision.",
      "isVisible": true,
      "order": 2
    },
    {
      "id": "step-customise",
      "number": "03",
      "title": "Customise",
      "description": "From measurements and material selections to stitching and finishing details, each element is thoughtfully considered.",
      "isVisible": true,
      "order": 3
    },
    {
      "id": "step-transform",
      "number": "04",
      "title": "Transform",
      "description": "Watch your vision come together as individual furnishings create a cohesive and beautiful space.",
      "isVisible": true,
      "order": 4
    }
  ]'::jsonb,
  true
)
ON CONFLICT (id) DO UPDATE SET
  badge = EXCLUDED.badge,
  heading_primary = EXCLUDED.heading_primary,
  heading_accent = EXCLUDED.heading_accent,
  intro_text = EXCLUDED.intro_text,
  cta_label = EXCLUDED.cta_label,
  steps = EXCLUDED.steps,
  is_visible = EXCLUDED.is_visible,
  updated_at = timezone('utc'::text, now());

-- ==========================================
-- 18. Create Why Atelier Living Section Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.why_atelier_living (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge TEXT NOT NULL DEFAULT 'WHY ATELIER LIVING',
  heading_primary TEXT NOT NULL DEFAULT 'The Art of Thoughtful',
  heading_accent TEXT DEFAULT 'Furnishing',
  subtitle TEXT DEFAULT '',
  cta_label TEXT DEFAULT 'Explore Bespoke Guidance',
  pillars JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.why_atelier_living ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select why_atelier_living" ON public.why_atelier_living;
CREATE POLICY "Public select why_atelier_living" ON public.why_atelier_living FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify why_atelier_living" ON public.why_atelier_living;
CREATE POLICY "Admin modify why_atelier_living" ON public.why_atelier_living FOR ALL USING (true);

INSERT INTO public.why_atelier_living (
  id, badge, heading_primary, heading_accent, subtitle, cta_label, pillars, is_visible
)
VALUES (
  'default',
  'WHY ATELIER LIVING',
  'The Art of Thoughtful',
  'Furnishing',
  '',
  'Explore Bespoke Guidance',
  '[
    {
      "id": "why-bespoke",
      "number": "01",
      "title": "Bespoke by Nature",
      "description": "Solutions personalised to the dimensions, style and character of your space.",
      "image": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
      "imageCaption": "Tailored Spatial Proportion",
      "isVisible": true,
      "order": 1
    },
    {
      "id": "why-curated",
      "number": "02",
      "title": "A Curated Selection",
      "description": "A considered collection of fabrics, wallpapers, rugs and furnishing materials.",
      "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=85",
      "imageCaption": "Tactile Material Archive",
      "isVisible": true,
      "order": 2
    },
    {
      "id": "why-craftsmanship",
      "number": "03",
      "title": "Craftsmanship in Every Detail",
      "description": "An appreciation for precision, tailoring, texture and refined finishes.",
      "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
      "imageCaption": "Refined Stitch & Finish",
      "isVisible": true,
      "order": 3
    },
    {
      "id": "why-one-roof",
      "number": "04",
      "title": "Everything Under One Roof",
      "description": "A convenient destination for coordinating the many elements that make an interior complete.",
      "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
      "imageCaption": "Cohesive Interior Composition",
      "isVisible": true,
      "order": 4
    },
    {
      "id": "why-designed-around-you",
      "number": "05",
      "title": "Designed Around You",
      "description": "Personalised guidance to make selecting your furnishings an enjoyable and inspiring experience.",
      "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "imageCaption": "Personalised Studio Guidance",
      "isVisible": true,
      "order": 5
    }
  ]'::jsonb,
  true
)
ON CONFLICT (id) DO UPDATE SET
  badge = EXCLUDED.badge,
  heading_primary = EXCLUDED.heading_primary,
  heading_accent = EXCLUDED.heading_accent,
  subtitle = EXCLUDED.subtitle,
  cta_label = EXCLUDED.cta_label,
  pillars = EXCLUDED.pillars,
  is_visible = EXCLUDED.is_visible,
  updated_at = timezone('utc'::text, now());

-- ==========================================
-- 19. Create Designers & Architects Trade Section Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.designers_architects_section (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge TEXT NOT NULL DEFAULT 'FOR DESIGNERS & ARCHITECTS',
  heading_primary TEXT NOT NULL DEFAULT 'A Creative Partner for',
  heading_accent TEXT DEFAULT 'Inspired Interiors',
  paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_label TEXT NOT NULL DEFAULT 'Collaborate With Us',
  hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
  image_caption TEXT DEFAULT 'Residential & Commercial Trade Collaborations',
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.designers_architects_section ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select designers_architects_section" ON public.designers_architects_section;
CREATE POLICY "Public select designers_architects_section" ON public.designers_architects_section FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify designers_architects_section" ON public.designers_architects_section;
CREATE POLICY "Admin modify designers_architects_section" ON public.designers_architects_section FOR ALL USING (true);

INSERT INTO public.designers_architects_section (
  id, badge, heading_primary, heading_accent, paragraphs, highlights, cta_label, hero_image, image_caption, is_visible
)
VALUES (
  'default',
  'FOR DESIGNERS & ARCHITECTS',
  'A Creative Partner for',
  'Inspired Interiors',
  '[
    "We collaborate with architects, interior designers and design professionals to bring thoughtfully conceived spaces to life.",
    "With an extensive range of furnishing options and customisation possibilities, Atelier Living helps translate design concepts into carefully coordinated furnishing selections.",
    "From individual rooms to larger residential and commercial projects, we value collaborative thinking and an uncompromising attention to detail."
  ]'::jsonb,
  '[
    "Residential Commissions",
    "Commercial Interiors",
    "Customisation Possibilities",
    "Coordinated Material Swatches"
  ]'::jsonb,
  'Collaborate With Us',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
  'Residential & Commercial Trade Collaborations',
  true
)
ON CONFLICT (id) DO UPDATE SET
  badge = EXCLUDED.badge,
  heading_primary = EXCLUDED.heading_primary,
  heading_accent = EXCLUDED.heading_accent,
  paragraphs = EXCLUDED.paragraphs,
  highlights = EXCLUDED.highlights,
  cta_label = EXCLUDED.cta_label,
  hero_image = EXCLUDED.hero_image,
  image_caption = EXCLUDED.image_caption,
  is_visible = EXCLUDED.is_visible,
  updated_at = timezone('utc'::text, now());

-- ==========================================
-- 20. Create Final Call To Action Section Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.final_cta_section (
  id TEXT PRIMARY KEY DEFAULT 'default',
  badge TEXT NOT NULL DEFAULT 'FINAL CALL TO ACTION',
  heading_primary TEXT NOT NULL DEFAULT 'Let''s Create',
  heading_accent TEXT DEFAULT 'Something Beautiful.',
  description TEXT NOT NULL DEFAULT 'Whether you have a complete vision or are just beginning to explore ideas, we''re here to help you find the perfect furnishings for your space.',
  cta_label TEXT NOT NULL DEFAULT 'Book Your Furnishing Consultation',
  background_image TEXT DEFAULT '',
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.final_cta_section ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select final_cta_section" ON public.final_cta_section;
CREATE POLICY "Public select final_cta_section" ON public.final_cta_section FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify final_cta_section" ON public.final_cta_section;
CREATE POLICY "Admin modify final_cta_section" ON public.final_cta_section FOR ALL USING (true);

INSERT INTO public.final_cta_section (
  id, badge, heading_primary, heading_accent, description, cta_label, background_image, is_visible
)
VALUES (
  'default',
  'FINAL CALL TO ACTION',
  'Let''s Create',
  'Something Beautiful.',
  'Whether you have a complete vision or are just beginning to explore ideas, we''re here to help you find the perfect furnishings for your space.',
  'Book Your Furnishing Consultation',
  '',
  true
)
ON CONFLICT (id) DO UPDATE SET
  badge = EXCLUDED.badge,
  heading_primary = EXCLUDED.heading_primary,
  heading_accent = EXCLUDED.heading_accent,
  description = EXCLUDED.description,
  cta_label = EXCLUDED.cta_label,
  background_image = EXCLUDED.background_image,
  is_visible = EXCLUDED.is_visible,
  updated_at = timezone('utc'::text, now());

-- ==========================================
-- 21. Create Homepage Dynamic Section Layout Ordering Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.home_section_layout (
  id TEXT PRIMARY KEY DEFAULT 'default',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.home_section_layout ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select home_section_layout" ON public.home_section_layout;
CREATE POLICY "Public select home_section_layout" ON public.home_section_layout FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify home_section_layout" ON public.home_section_layout;
CREATE POLICY "Admin modify home_section_layout" ON public.home_section_layout FOR ALL USING (true);

INSERT INTO public.home_section_layout (id, sections)
VALUES (
  'default',
  '[
    { "id": "hero", "isVisible": true, "order": 0 },
    { "id": "brand-story", "isVisible": true, "order": 1 },
    { "id": "collections", "isVisible": true, "order": 2 },
    { "id": "atelier-experience", "isVisible": true, "order": 3 },
    { "id": "why-atelier", "isVisible": true, "order": 4 },
    { "id": "designers-architects", "isVisible": true, "order": 5 },
    { "id": "final-cta", "isVisible": true, "order": 6 },
    { "id": "featured-projects", "isVisible": true, "order": 7 },
    { "id": "brands-marquee", "isVisible": true, "order": 8 },
    { "id": "testimonials", "isVisible": true, "order": 9 }
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  sections = EXCLUDED.sections,
  updated_at = timezone('utc'::text, now());

-- ==========================================
-- 22. Create Dynamic Footer Settings & Links Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.footer_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  newsletter_visible BOOLEAN DEFAULT true,
  newsletter_badge TEXT DEFAULT 'The Atelier Gazette',
  newsletter_heading TEXT DEFAULT 'Receive Curated Textile Archives & Private Exhibition Invitations',
  newsletter_subtitle TEXT DEFAULT 'Subscribe to receive our seasonal lookbooks, material sourcing documentaries, and private showroom events.',
  newsletter_placeholder TEXT DEFAULT 'Enter your email address...',
  newsletter_button_label TEXT DEFAULT 'Join',
  newsletter_success_text TEXT DEFAULT 'Welcome to The Atelier Circle. Lookbook sent.',
  brand_logo_image TEXT DEFAULT '',
  brand_logo_monogram TEXT DEFAULT 'A',
  brand_logo_title TEXT DEFAULT 'Atelier Living',
  brand_description TEXT DEFAULT 'Atelier Living is an international interior design house crafting bespoke textiles, architectural drapes, structural upholstery, hand-knotted rugs, and limited-edition atelier artifacts for fine private residences, superyachts, and boutique luxury hotels.',
  show_social_links BOOLEAN DEFAULT true,
  collections_heading TEXT DEFAULT 'OUR COLLECTIONS',
  collection_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  quick_links_heading TEXT DEFAULT 'Quick Links',
  quick_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  showroom_heading TEXT DEFAULT 'Ahmedabad Atelier',
  address TEXT DEFAULT '48 Berkeley Square, Mayfair, London W1J 5AW',
  phone TEXT DEFAULT '+44 (0)20 7946 0188',
  mobile TEXT DEFAULT '+44 7911 123456',
  email TEXT DEFAULT 'concierge@atelier-living.com',
  show_email BOOLEAN DEFAULT true,
  show_cta_button BOOLEAN DEFAULT true,
  cta_button_label TEXT DEFAULT 'Order Material Swatches',
  cta_button_target TEXT DEFAULT 'swatches',
  cta_button_url TEXT DEFAULT '',
  copyright_text TEXT DEFAULT '© 2026 Atelier Living. All rights reserved.',
  bottom_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select footer_settings" ON public.footer_settings;
CREATE POLICY "Public select footer_settings" ON public.footer_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin modify footer_settings" ON public.footer_settings;
CREATE POLICY "Admin modify footer_settings" ON public.footer_settings FOR ALL USING (true);

INSERT INTO public.footer_settings (
  id,
  collections_heading,
  collection_links,
  quick_links_heading,
  quick_links,
  bottom_links
)
VALUES (
  'default',
  'OUR COLLECTIONS',
  '[
    { "id": "fc-1", "label": "Bespoke Drapes", "target": "category", "categorySlug": "drapes-curtains", "isVisible": true, "order": 0 },
    { "id": "fc-2", "label": "Upholstery & Fabrics", "target": "category", "categorySlug": "upholstery-fabrics", "isVisible": true, "order": 1 },
    { "id": "fc-3", "label": "Wallpapers & Wallcoverings", "target": "category", "categorySlug": "wallpapers-wallcoverings", "isVisible": true, "order": 2 },
    { "id": "fc-4", "label": "Rugs & Carpets", "target": "category", "categorySlug": "rugs-carpets", "isVisible": true, "order": 3 },
    { "id": "fc-5", "label": "Mattresses & Sleep Comfort", "target": "category", "categorySlug": "mattresses-sleep-comfort", "isVisible": true, "order": 4 },
    { "id": "fc-6", "label": "Custom Furnishing Solutions", "target": "category", "categorySlug": "custom-furnishing-solutions", "isVisible": true, "order": 5 }
  ]'::jsonb,
  'Quick Links',
  '[
    { "id": "fq-1", "label": "Home", "target": "home", "isVisible": true, "order": 0 },
    { "id": "fq-2", "label": "Our Story", "target": "story", "isVisible": true, "order": 1 },
    { "id": "fq-3", "label": "Collections", "target": "section:curated-collections", "isVisible": true, "order": 2 },
    { "id": "fq-4", "label": "Projects", "target": "projects", "isVisible": true, "order": 3 },
    { "id": "fq-5", "label": "For Professionals", "target": "section:designers-architects", "isVisible": true, "order": 4 },
    { "id": "fq-6", "label": "Contact Us", "target": "contact", "isVisible": true, "order": 5 }
  ]'::jsonb,
  '[
    { "id": "fb-1", "label": "Craft Philosophy", "target": "story", "isVisible": true, "order": 0 },
    { "id": "fb-2", "label": "Private Consultation", "target": "contact", "isVisible": true, "order": 1 },
    { "id": "fb-3", "label": "Master Admin Portal", "target": "admin", "isVisible": true, "order": 2 }
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collections_heading = EXCLUDED.collections_heading,
  collection_links = EXCLUDED.collection_links,
  quick_links_heading = EXCLUDED.quick_links_heading,
  quick_links = EXCLUDED.quick_links,
  bottom_links = EXCLUDED.bottom_links,
  updated_at = timezone('utc'::text, now());



