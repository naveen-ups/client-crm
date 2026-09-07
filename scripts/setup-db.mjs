import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local and .env
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  dotenv.config({ path: path.join(rootDir, '.env.local') });
}
if (fs.existsSync(path.join(rootDir, '.env'))) {
  dotenv.config({ path: path.join(rootDir, '.env') });
}

const { Client } = pg;

async function runSetup() {
  console.log('✦ Aurumm CRM: Database Setup Script\n');

  // Allow database URL from CLI arg or environment
  let dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ Error: DATABASE_URL is missing!\n');
    console.log('To run database migrations directly from your terminal, you need your database connection string.');
    console.log('Where to find it in Supabase:');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Select your project -> Click Settings (gear icon) -> "Database"');
    console.log('3. Scroll to "Connection String" -> Select "URI"');
    console.log('4. Copy the connection string and add it to your client-crm/.env.local:');
    console.log('   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.mpkazxmtivysustkrgvw.supabase.co:5432/postgres\n');
    console.log('Or run with the URI directly:');
    console.log('   npm run db:setup "postgresql://postgres:[YOUR-PASSWORD]@db.mpkazxmtivysustkrgvw.supabase.co:5432/postgres"\n');
    process.exit(1);
  }

  // Ensure SSL is enabled for Supabase
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const sqlFilePath = path.join(rootDir, 'supabase', 'setup-all.sql');
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found at ${sqlFilePath}`);
    }

    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('Executing setup-all.sql (creating tables, policies, bucket, and seed data)...');
    
    await client.query(sql);

    console.log('✅ Successfully applied schema and seed data to Supabase!');
    console.log('\nCreated Tables:');
    console.log('  • public.site_content');
    console.log('  • public.collections');
    console.log('  • public.custom_categories');
    console.log('  • public.gemstones');
    console.log('  • public.testimonials');
    console.log('  • public.plans');
    console.log('  • public.leads');
    console.log('  • storage.buckets: aurumm-media');
    console.log('\nYour CRM and website are ready to use!');
  } catch (err) {
    console.error('\n❌ Database setup error:', err.message);
    if (err.message.includes('password authentication failed')) {
      console.error('\nTip: Make sure you replaced [YOUR-PASSWORD] with the database password you chose when creating the project.');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSetup();
