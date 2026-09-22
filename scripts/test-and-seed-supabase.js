import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env manually if dotenv isn't installed
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
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

async function runCheck() {
  const tables = [
    'swatch_requests',
    'products',
    'admin_users',
    'admin_audit_logs',
    'contact_inquiries',
    'newsletter_subscribers',
    'showrooms',
    'contact_settings',
    'projects',
    'site_settings',
    'testimonials',
    'brand_partners',
    'story_settings'
  ];

  console.log('\n--- Checking Supabase Database Tables ---');
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(3);

      if (error) {
        console.log(`❌ Table [${table}]: ERROR (${error.code || error.message}) -> ${error.message}`);
      } else {
        console.log(`✅ Table [${table}]: OK (${count !== null ? count : data?.length} rows found)`);
      }
    } catch (e) {
      console.log(`❌ Table [${table}]: EXCEPTION ->`, e.message);
    }
  }
}

runCheck();
