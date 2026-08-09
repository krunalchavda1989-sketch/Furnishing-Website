import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : '';
};

const url = getEnv('VITE_SUPABASE_URL');
const serviceKey = getEnv('VITE_SUPABASE_SERVICE_ROLE_KEY');

console.log('Target Supabase URL:', url);
console.log('Service Role Key Loaded:', Boolean(serviceKey));

const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
const sqlContent = fs.readFileSync(schemaPath, 'utf8');

// Supabase Admin Client
const adminSupabase = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

async function main() {
  const ref = url.replace('https://', '').replace('.supabase.co', '');

  // 1. Try Supabase SQL Query API Endpoint with Service Role Key
  try {
    const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: sqlContent })
    });
    console.log('REST RPC exec_sql Status:', response.status);
    if (response.ok) {
      console.log('SQL Schema executed successfully via RPC exec_sql!');
    }
  } catch (err) {
    console.log('RPC exec_sql error:', err.message);
  }

  // 2. Try Supabase Management API endpoint
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/db/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sqlContent })
    });
    console.log('Management API SQL Status:', res.status);
    if (res.ok) {
      console.log('SQL Schema executed successfully via Management API!');
    }
  } catch (err) {
    console.log('Management API error:', err.message);
  }

  // 3. Inspect Table Statuses & Seed via Supabase REST API
  console.log('\n--- Checking Table Statuses in Supabase Cloud DB ---');
  const tables = ['swatch_requests', 'products', 'admin_users', 'admin_audit_logs', 'contact_inquiries', 'newsletter_subscribers'];

  for (const table of tables) {
    const { data, error } = await adminSupabase.from(table).select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table [${table}]: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`✅ Table [${table}]: ONLINE & ACCESSIBLE (Rows: ${data !== null ? data : 0})`);
    }
  }

  // 4. Try Seeding Data via Supabase API if tables are accessible
  console.log('\n--- Seeding Initial Data into Supabase DB ---');

  // Seed Admin User
  const { error: adminErr } = await adminSupabase.from('admin_users').upsert({
    id: 'adm-001',
    name: 'Lady Vivienne Sterling',
    email: 'admin@maison-drape.com',
    role: 'Master Curator',
    status: 'Active'
  }, { onConflict: 'email' });
  if (adminErr) console.log('Admin user seed status:', adminErr.message);
  else console.log('✅ Admin user seed: SUCCESS');

  // Seed Swatch Requests
  const { error: swatchErr } = await adminSupabase.from('swatch_requests').upsert([
    {
      client_name: 'Lord Alistair Crawford',
      email: 'a.crawford@mayfair-estates.co.uk',
      phone: '+44 20 7946 0912',
      address: '14 Grosvenor Square, Mayfair, London W1K 6LD',
      category_title: 'Bespoke Fabrics',
      category_slug: 'fabrics',
      swatches_requested: ['Como Raw Silk', 'Belgian Flanders Flax Linen'],
      status: 'Pending'
    },
    {
      client_name: 'Madame Genevieve Laurent',
      email: 'g.laurent@laurent-interiors.fr',
      phone: '+33 1 42 68 55 00',
      address: '28 Avenue Montaigne, 75008 Paris, France',
      category_title: 'Curtains & Upholstery',
      category_slug: 'curtains-upholstery',
      swatches_requested: ['Florentine Mohair Velvet', 'Acoustic Sheer Flax'],
      status: 'Dispatched'
    }
  ]);
  if (swatchErr) console.log('Swatch requests seed status:', swatchErr.message);
  else console.log('✅ Swatch requests seed: SUCCESS');

  // Seed Contact Inquiries
  const { error: inqErr } = await adminSupabase.from('contact_inquiries').upsert([
    {
      client_name: 'Lady Eleanor Vance',
      email: 'e.vance@mayfair-villas.co.uk',
      phone: '+44 20 7946 0811',
      product_interest: 'Bespoke Fabrics',
      project_scope: 'Full Villa Refurbishment',
      preferred_showroom: 'London Mayfair Showroom',
      message: 'Requesting initial consultation for silk drape installation in Mayfair penthouse.',
      status: 'New'
    },
    {
      client_name: 'Viscount Harrison Thorne',
      email: 'h.thorne@kensington-residences.com',
      phone: '+44 20 7946 0722',
      product_interest: 'Curtains & Upholstery',
      project_scope: 'Drawing Room Upholstery',
      preferred_showroom: 'Paris Avenue Montaigne Showroom',
      message: 'Interested in velvet upholstery for historical drawing room chairs.',
      status: 'Contacted'
    }
  ]);
  if (inqErr) console.log('Contact inquiries seed status:', inqErr.message);
  else console.log('✅ Contact inquiries seed: SUCCESS');

  // Seed Audit Log
  const { error: auditErr } = await adminSupabase.from('admin_audit_logs').insert({
    admin_email: 'admin@maison-drape.com',
    action: 'SYSTEM_INITIALIZATION',
    details: 'Master Admin Gateway linked with Supabase Cloud Database'
  });
  if (auditErr) console.log('Audit log seed status:', auditErr.message);
  else console.log('✅ Audit log seed: SUCCESS');

  // Seed Newsletter Subscribers
  const { error: subErr } = await adminSupabase.from('newsletter_subscribers').upsert([
    { email: 'crawford.estates@mayfair-estates.co.uk', source: 'Footer Gazette', status: 'VIP Privé' },
    { email: 'g.laurent@laurent-interiors.fr', source: 'Exhibition Banner', status: 'Subscribed' },
    { email: 'harrison.thorne@kensington-residences.com', source: 'Footer Gazette', status: 'Subscribed' }
  ], { onConflict: 'email' });
  if (subErr) console.log('Newsletter subscribers seed status:', subErr.message);
  else console.log('✅ Newsletter subscribers seed: SUCCESS');
}

main();
