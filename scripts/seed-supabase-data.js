import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, serviceKey);

async function seedData() {
  console.log('\n--- Seeding / Updating Live Supabase Database ---');

  // 1. Seed Admin User
  try {
    const adminEmail = (env.VITE_ADMIN_DEFAULT_EMAIL || 'admin@maison-drape.com').toLowerCase();
    const { error: adminErr } = await supabase.from('admin_users').upsert({
      id: 'adm-001',
      name: 'Lady Vivienne Sterling',
      email: adminEmail,
      role: 'Master Curator',
      status: 'Active',
      last_login: new Date().toISOString()
    });
    if (adminErr) console.log('Admin user seed error:', adminErr.message);
    else console.log('✅ Admin user synced:', adminEmail);
  } catch (e) {
    console.log('Admin user exception:', e.message);
  }

  // 2. Seed Catalog Products
  try {
    const { PRODUCTS_DATA } = await import('../src/data/productsData.ts');
    for (const prod of PRODUCTS_DATA) {
      const { error: prodErr } = await supabase.from('products').upsert({
        id: prod.id,
        name: prod.name,
        category_slug: prod.categorySlug,
        category_name: prod.categoryName,
        short_description: prod.shortDescription,
        full_description: prod.fullDescription,
        material_composition: prod.materialComposition,
        width_or_dimensions: prod.widthOrDimensions,
        origin: prod.origin,
        price_category: prod.priceCategory,
        image: prod.image,
        swatch_type: prod.swatchType
      });
      if (prodErr) console.log(`Product [${prod.name}] error:`, prodErr.message);
    }
    console.log(`✅ Synced ${PRODUCTS_DATA.length} products to Supabase.`);
  } catch (e) {
    console.log('Products seed exception:', e.message);
  }

  // 3. Seed Initial Audit Log
  try {
    const { error: logErr } = await supabase.from('admin_audit_logs').insert({
      admin_email: 'admin@maison-drape.com',
      action: 'SYSTEM_DATABASE_SYNC',
      details: 'Live database synchronization verified and updated across all modules.'
    });
    if (logErr) console.log('Audit log insert error:', logErr.message);
    else console.log('✅ Security audit log entry created');
  } catch (e) {
    console.log('Audit log exception:', e.message);
  }

  // 3. Test other tables
  const optionalTables = [
    'products',
    'showrooms',
    'projects',
    'site_settings',
    'contact_settings',
    'testimonials',
    'brand_partners',
    'story_settings'
  ];

  for (const table of optionalTables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.log(`⚠️  Table [${table}] requires SQL migration in Supabase SQL Editor.`);
      } else {
        console.log(`✅ Table [${table}] is active in live Supabase DB.`);
      }
    } catch (e) {
      console.log(`⚠️  Table [${table}] exception:`, e.message);
    }
  }
}

seedData();
