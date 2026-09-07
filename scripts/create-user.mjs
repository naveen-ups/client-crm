import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local');
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
let email = '';
let password = '';
let siteId = ''; // e.g. 'aurumm'
let role = '';   // 'root' or 'site_admin'

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1];
    i++;
  } else if (args[i] === '--password' && args[i + 1]) {
    password = args[i + 1];
    i++;
  } else if (args[i] === '--site' && args[i + 1]) {
    siteId = args[i + 1];
    i++;
  } else if (args[i] === '--role' && args[i + 1]) {
    role = args[i + 1];
    i++;
  }
}

// Defaults
if (!siteId && !role) {
  // If neither specified, default to Aurumm site user
  siteId = 'aurumm';
  role = 'site_admin';
} else if (siteId && !role) {
  role = 'site_admin';
} else if (!siteId && role === 'root') {
  siteId = '';
}

if (!email) {
  email = siteId ? `${siteId}@aurumm.com` : 'admin@aurumm.com';
}
if (!password) {
  password = siteId ? 'AurummSecure2026!' : 'AurummRootSecure2026!';
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('✦ Aurumm CRM User Provisioning');
  console.log(`✦ Target Email: ${email}`);
  console.log(`✦ Role:         ${role}`);
  console.log(`✦ Site Access:  ${siteId ? siteId : 'ALL WEBSITES (Root)'}`);

  const metadata = {
    role,
    ...(siteId ? { site_id: siteId, allowed_sites: [siteId] } : { allowed_sites: ['*'] }),
  };

  try {
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const existingUser = userList.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      console.log(`ℹ️ User ${email} already exists (ID: ${existingUser.id}). Updating metadata and password...`);
      const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          app_metadata: metadata,
          user_metadata: { ...metadata, name: siteId ? `${siteId} Manager` : 'Root Administrator' },
        }
      );

      if (updateError) throw updateError;
      console.log('✅ User updated successfully!');
      console.log(`   User ID:     ${updated.user.id}`);
      console.log(`   Email:       ${updated.user.email}`);
      console.log(`   Role:        ${role}`);
      console.log(`   Site Access: ${siteId ? siteId + ' only' : 'All Websites'}`);
      console.log(`   Password:    ${password}`);
    } else {
      console.log(`Creating new user with email: ${email}...`);
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: metadata,
        user_metadata: { ...metadata, name: siteId ? `${siteId} Manager` : 'Root Administrator' },
      });

      if (createError) throw createError;
      console.log('✅ User created successfully!');
      console.log(`   User ID:     ${created.user.id}`);
      console.log(`   Email:       ${created.user.email}`);
      console.log(`   Role:        ${role}`);
      console.log(`   Site Access: ${siteId ? siteId + ' only' : 'All Websites'}`);
      console.log(`   Password:    ${password}`);
    }

    console.log('\n✦ You can now sign in at http://localhost:3000/login using these credentials.');
  } catch (err) {
    console.error('❌ Failed to provision user:', err.message || err);
    process.exit(1);
  }
}

main();
