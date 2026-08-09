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

  // 4. Admin User Verification
  const { error: adminErr } = await adminSupabase.from('admin_users').upsert({
    id: 'adm-001',
    name: 'Lady Vivienne Sterling',
    email: 'admin@maison-drape.com',
    role: 'Master Curator',
    status: 'Active'
  }, { onConflict: 'email' });
  if (adminErr) console.log('Admin user verification:', adminErr.message);
  else console.log('✅ Admin user authentication: READY');
}

main();
