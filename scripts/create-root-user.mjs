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

// Parse args or use defaults
const args = process.argv.slice(2);
let email = 'admin2026@aurumm.com';
let password = 'AurummRootSecure2026!';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1];
    i++;
  } else if (args[i] === '--password' && args[i + 1]) {
    password = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--')) {
    if (i === 0) email = args[i];
    if (i === 1) password = args[i];
  }
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('✦ Aurumm CRM Root User Provisioning');
  console.log(`✦ Target Email: ${email}`);

  try {
    // Check if user already exists
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }

    const existingUser = userList.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      console.log(`ℹ️ User ${email} already exists (ID: ${existingUser.id}). Updating password and root role...`);
      const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          app_metadata: { role: 'root' },
          user_metadata: { role: 'root', name: 'Root Administrator' },
        }
      );

      if (updateError) throw updateError;
      console.log('✅ Root user credentials updated successfully!');
      console.log(`   User ID:  ${updated.user.id}`);
      console.log(`   Email:    ${updated.user.email}`);
      console.log(`   Role:     root (All permissions)`);
      console.log(`   Password: ${password}`);
    } else {
      console.log(`Creating new root user with email: ${email}...`);
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: 'root' },
        user_metadata: { role: 'root', name: 'Root Administrator' },
      });

      if (createError) throw createError;
      console.log('✅ Root user created successfully!');
      console.log(`   User ID:  ${created.user.id}`);
      console.log(`   Email:    ${created.user.email}`);
      console.log(`   Role:     root (All permissions)`);
      console.log(`   Password: ${password}`);
    }

    console.log('\n✦ You can now sign in at http://localhost:3000/login using these credentials.');
  } catch (err) {
    console.error('❌ Failed to provision root user:', err.message || err);
    process.exit(1);
  }
}

main();
