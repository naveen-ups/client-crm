import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  dotenv.config({ path: path.join(rootDir, '.env.local') });
}
if (fs.existsSync(path.join(rootDir, '.env'))) {
  dotenv.config({ path: path.join(rootDir, '.env') });
}

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('✦ Aurumm CRM: Seeding Data via Supabase Client\n');
  console.log(`Connecting to: ${supabaseUrl}`);

  // 1. Site Content
  console.log('Seeding site_content...');
  const siteSections = [
    {
      id: 'hero',
      section_name: 'Hero Section',
      title: 'DESIGNED FOR YOUR LEGACY',
      subtitle: 'Where Artistry meets Meaning',
      description:
        'Every piece we create begins with your story. Handcrafted with ethically sourced gemstones and timeless craft, jewellery that endures.',
      image_url: '/hero.png',
      data: {
        heading_line1: 'DESIGNED FOR',
        heading_line2: 'YOUR LEGACY',
        cta1_label: 'DISCOVER OUR CREATIONS',
        cta1_link: '#shop',
        cta2_label: 'BOOK A PRIVATE CONSULTATION',
        cta2_link: '#book',
      },
    },
    {
      id: 'philosophy',
      section_name: 'Our Philosophy',
      title: 'where Artistry meets Meaning',
      subtitle: 'Our Philosophy',
      description:
        'We believe jewellery is not merely an ornament — it is an intimate expression of identity, heritage, and memory. Each piece is crafted with reverence, honouring rare gemstones and timeless artisanal mastery.',
      image_url: '/PHILOSOPHY_1.png',
      data: {
        stats: [
          { value: '500+', label: 'Bespoke Pieces Created' },
          { value: '100%', label: 'Ethically Sourced Gems' },
          { value: '15+', label: 'Countries Served' },
          { value: '5★', label: 'Client Satisfaction' },
        ],
      },
    },
    {
      id: 'founder',
      section_name: 'Meet the Founder',
      title: 'Meet the Founder',
      subtitle: 'The Visionary',
      description:
        'With over a decade of dedicated expertise in gemology and high jewellery design, Pooja Roy envisions jewellery as wearable sacred art. Every commission is personally overseen from rough gem sourcing to final polish.',
      image_url: '/Poojaroy.png',
      data: {
        founder_name: 'Pooja Roy',
        founder_title: 'Founder & Master Gemologist',
        quote:
          "True luxury is born when fine craft honors nature's most extraordinary gifts and personal histories.",
        expertise: [
          'GIA Certified Gemologist',
          'Vedic Astrology',
          '3D CAD Design',
          'Ethical Sourcing',
        ],
      },
    },
    {
      id: 'heritage',
      section_name: 'Heritage Redesign',
      title: 'Honouring the Past, Reimagining the Future',
      subtitle: 'Heritage Redesign',
      description:
        'Transform your treasured ancestral jewellery into contemporary masterpieces while preserving their emotional essence and original gemstones.',
      image_url: '/earring-1.png',
      data: {
        before_image: '/earring-1.png',
        after_image: '/ear ring after design.png',
        features: [
          'Full assessment & valuation of your heirloom',
          'Hand-drawn redesign concepts for your approval',
          'Careful stone extraction and reuse',
          'Photographic documentation throughout',
          'Certificate of provenance with finished piece',
        ],
      },
    },
    {
      id: 'footer',
      section_name: 'Footer & Contact Info',
      title: 'Aurumm Studio',
      subtitle: 'Bespoke Fine Jewellery',
      description:
        'Creating modern heirlooms and astrological fine jewellery for those who value meaning as much as beauty.',
      image_url: '/Logo.png',
      data: {
        phone: '+91 9315574332',
        email: 'aurumm.designstudio@gmail.com',
        alt_email: 'tnavin989@gmail.com',
        address: 'Aurumm Design Studio, New Delhi, India',
        instagram: 'https://instagram.com',
        whatsapp: '+919315574332',
      },
    },
  ];

  for (const item of siteSections) {
    const { error } = await supabase.from('site_content').upsert(item);
    if (error) console.error(`  ⚠️ site_content (${item.id}):`, error.message);
  }
  console.log('  ✅ site_content seeded.');

  // 2. Collections
  console.log('Seeding collections...');
  const collections = [
    {
      title: 'Engagement Rings',
      description: 'Sacred promises set in solid gold and GIA certified diamonds.',
      image_url: '/Engagement Rings.png',
      badge: 'Bridal Collection',
      link: '#custom',
      sort_order: 1,
      is_active: true,
    },
    {
      title: 'Statement Necklaces',
      description: 'Command any room with handcrafted luxury statement pieces.',
      image_url: '/Statement Necklaces.png',
      badge: 'Haute Joaillerie',
      link: '#custom',
      sort_order: 2,
      is_active: true,
    },
    {
      title: 'Heirloom Pieces',
      description: 'Redesigned with reverence for your ancestral gemstones.',
      image_url: '/Heirloom Pieces.png',
      badge: 'Heritage Redesign',
      link: '#heritage',
      sort_order: 3,
      is_active: true,
    },
    {
      title: 'Everyday Luxury',
      description: 'Refined, lightweight gold jewelry for daily elegance.',
      image_url: '/Everyday Luxury.png',
      badge: 'Essential Edit',
      link: '#custom',
      sort_order: 4,
      is_active: true,
    },
    {
      title: 'Gemstone Cuffs',
      description: 'Astrologically guided natural gems aligned with Vedic charts.',
      image_url: '/Gemstone Cuffs.png',
      badge: 'Astrology Guided',
      link: '#gemstone',
      sort_order: 5,
      is_active: true,
    },
  ];
  for (const c of collections) {
    await supabase.from('collections').upsert(c, { onConflict: 'title' });
  }
  console.log('  ✅ collections seeded.');

  // 3. Gemstones
  console.log('Seeding gemstones...');
  const gemstones = [
    {
      name: 'Blue Sapphire',
      planet: 'Saturn',
      description: 'Saturn · Resonates with discipline, focus, and inner authority.',
      image_url: '/blue-sapphire.png',
      badge: 'Saturn Planet',
      link: '#book',
      sort_order: 1,
    },
    {
      name: 'Emerald',
      planet: 'Mercury',
      description: 'Mercury · Enhances communication, intellect, and wealth.',
      image_url: '/emerald.png',
      badge: 'Mercury Planet',
      link: '#book',
      sort_order: 2,
    },
    {
      name: 'Yellow Sapphire',
      planet: 'Jupiter',
      description: 'Jupiter · Brings wisdom, prosperity, and divine grace.',
      image_url: '/yellow-sapphire.png',
      badge: 'Jupiter Planet',
      link: '#book',
      sort_order: 3,
    },
    {
      name: 'Ruby',
      planet: 'Sun',
      description: 'Sun · Amplifies leadership, vital energy, and courage.',
      image_url: '/ruby.png',
      badge: 'Sun Planet',
      link: '#book',
      sort_order: 4,
    },
    {
      name: 'Amethyst',
      planet: 'Saturn',
      description: 'Saturn · Fosters spiritual calm, clarity, and intuition.',
      image_url: '/amethyst.png',
      badge: 'Saturn Planet',
      link: '#book',
      sort_order: 5,
    },
    {
      name: 'Aquamarine',
      planet: 'Moon',
      description: 'Moon · Inspires tranquility, emotional healing, and balance.',
      image_url: '/aquamarine.png',
      badge: 'Moon Planet',
      link: '#book',
      sort_order: 6,
    },
  ];
  for (const g of gemstones) {
    await supabase.from('gemstones').upsert(g, { onConflict: 'name' });
  }
  console.log('  ✅ gemstones seeded.');

  // 4. Sample Leads
  console.log('Seeding initial leads...');
  const leads = [
    {
      name: 'Radhika Sharma',
      email: 'radhika.s@example.com',
      phone: '+91 9876543210',
      message: 'Looking for a bespoke emerald ring for our 10th anniversary.',
      status: 'new',
      preferred_gemstone: 'Emerald',
      budget_range: '₹1,50,000 - ₹2,50,000',
      consultant_notes: 'Interested in Colombian emerald with certificate.',
    },
    {
      name: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      phone: '+91 9811223344',
      message: 'Need Vedic consultation for Blue Sapphire cuff in 18k yellow gold.',
      status: 'contacted',
      preferred_gemstone: 'Blue Sapphire',
      budget_range: '₹2,00,000+',
      consultant_notes: 'Initial call scheduled for Wednesday 4pm.',
    },
  ];
  for (const l of leads) {
    await supabase.from('leads').upsert(l, { onConflict: 'email' });
  }
  console.log('  ✅ sample leads seeded.');

  console.log('\n🎉 Seed process completed successfully!');
}

seedData();
