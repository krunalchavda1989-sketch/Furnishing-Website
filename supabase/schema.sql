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

-- =======================================================
-- INITIAL DEFAULT SEED DATA INSERTION
-- =======================================================

-- Seed Site Settings
INSERT INTO public.site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- Seed Contact Settings
INSERT INTO public.contact_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- Seed Our Story Settings
INSERT INTO public.story_settings (id) VALUES ('global-story') ON CONFLICT (id) DO NOTHING;

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
