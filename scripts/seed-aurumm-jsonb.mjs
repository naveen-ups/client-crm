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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('✦ Seeding Aurumm Website JSONB Data to Supabase...\n');

  // Import default content
  const { DEFAULT_COMPLETE_WEBSITE_CONTENT } = await import('../src/lib/default-content.js').catch(async () => {
    // Fallback if ts/js resolution
    return await import('../dist/default-content.js').catch(() => ({}));
  });

  const contentToSeed = DEFAULT_COMPLETE_WEBSITE_CONTENT || {
    sections: {
      hero: {
        id: 'hero',
        section_name: 'Hero Section',
        title: 'DESIGNED FOR YOUR LEGACY',
        subtitle: 'Where Artistry meets Meaning',
        description: 'Every piece we create begins with your story. Handcrafted with ethically sourced gemstones and timeless craft, jewellery that endures.',
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
      philosophy: {
        id: 'philosophy',
        section_name: 'Our Philosophy',
        title: 'where Artistry meets Meaning',
        subtitle: 'Our Philosophy',
        description: 'We believe jewellery is not merely an ornament — it is an intimate expression of identity, heritage, and memory. Each piece is crafted with reverence, honouring rare gemstones and timeless artisanal mastery.',
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
      founder: {
        id: 'founder',
        section_name: 'Meet the Founder',
        title: 'Meet the Founder',
        subtitle: 'The Visionary',
        description: 'With over a decade of dedicated expertise in gemology and high jewellery design, Pooja Roy envisions jewellery as wearable sacred art. Every commission is personally overseen from rough gem sourcing to final polish.',
        image_url: '/Poojaroy.png',
        data: {
          founder_name: 'Pooja Roy',
          founder_title: 'Founder & Master Gemologist',
          quote: "True luxury is born when fine craft honors nature's most extraordinary gifts and personal histories.",
          expertise: [
            'GIA Certified Gemologist',
            'Vedic Astrology',
            '3D CAD Design',
            'Ethical Sourcing',
          ],
        },
      },
      heritage: {
        id: 'heritage',
        section_name: 'Heritage Redesign',
        title: 'Honouring the Past, Reimagining the Future',
        subtitle: 'Heritage Redesign',
        description: 'Transform your treasured ancestral jewellery into contemporary masterpieces while preserving their emotional essence and original gemstones.',
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
      footer: {
        id: 'footer',
        section_name: 'Footer & Contact Info',
        title: 'Aurumm Studio',
        subtitle: 'Bespoke Fine Jewellery',
        description: 'Creating modern heirlooms and astrological fine jewellery for those who value meaning as much as beauty.',
        image_url: '/Logo.png',
        data: {
          phone: '+91 9315574332',
          email: 'aurumm.designstudio@gmail.com',
          alt_email: 'tnavin989@gmail.com',
          address: 'Aurumm Design Studio, New Delhi, India',
          instagram: 'https://instagram.com',
          whatsapp: '+919315574332',
          copyright: '© 2026 Aurumm Design Studio. All Rights Reserved.',
        },
      },
    },
    collections: [
      {
        id: 'col-1',
        title: 'Engagement Rings',
        description: 'Sacred promises set in solid gold and GIA certified diamonds.',
        image_url: '/Engagement Rings.png',
        badge: 'Bridal Collection',
        link: '#custom',
        sort_order: 1,
        is_active: true,
      },
      {
        id: 'col-2',
        title: 'Statement Necklaces',
        description: 'Command any room with handcrafted luxury statement pieces.',
        image_url: '/Statement Necklaces.png',
        badge: 'Haute Joaillerie',
        link: '#custom',
        sort_order: 2,
        is_active: true,
      },
      {
        id: 'col-3',
        title: 'Heirloom Pieces',
        description: 'Redesigned with reverence for your ancestral gemstones.',
        image_url: '/Heirloom Pieces.png',
        badge: 'Heritage Redesign',
        link: '#heritage',
        sort_order: 3,
        is_active: true,
      },
      {
        id: 'col-4',
        title: 'Everyday Luxury',
        description: 'Refined, lightweight gold jewelry for daily elegance.',
        image_url: '/Everyday Luxury.png',
        badge: 'Essential Edit',
        link: '#custom',
        sort_order: 4,
        is_active: true,
      },
      {
        id: 'col-5',
        title: 'Gemstone Cuffs',
        description: 'Astrologically guided natural gems aligned with Vedic charts.',
        image_url: '/Gemstone Cuffs.png',
        badge: 'Astrology Guided',
        link: '#gemstone',
        sort_order: 5,
        is_active: true,
      },
    ],
    customCategories: [
      {
        id: 'cust-1',
        title: 'Engagement & Wedding',
        description: "Rings, bands, and bridal sets crafted to mark life's most sacred promises.",
        image_url: '/Engagement & Wedding.png',
        badge: 'Bespoke Bridal',
        link: '#book',
        sort_order: 1,
        is_active: true,
      },
      {
        id: 'cust-2',
        title: 'Statement Pieces',
        description: 'Bold necklaces, chandelier earrings, and cuffs designed to command attention.',
        image_url: '/Statement Pieces.png',
        badge: 'Haute Joaillerie',
        link: '#book',
        sort_order: 2,
        is_active: true,
      },
      {
        id: 'cust-3',
        title: 'Everyday Luxury',
        description: 'Refined pieces for daily wear — elegant enough for any occasion.',
        image_url: '/Everyday Luxury.png',
        badge: 'Daily Luxury',
        link: '#book',
        sort_order: 3,
        is_active: true,
      },
    ],
    gemstones: [
      {
        id: 'gem-1',
        name: 'Blue Sapphire',
        planet: 'Saturn',
        description: 'Saturn · Resonates with discipline, focus, and inner authority.',
        image_url: '/blue-sapphire.png',
        badge: 'Saturn Planet',
        link: '#book',
        sort_order: 1,
        is_active: true,
      },
      {
        id: 'gem-2',
        name: 'Emerald',
        planet: 'Mercury',
        description: 'Mercury · Enhances communication, intellect, and wealth.',
        image_url: '/emerald.png',
        badge: 'Mercury Planet',
        link: '#book',
        sort_order: 2,
        is_active: true,
      },
      {
        id: 'gem-3',
        name: 'Yellow Sapphire',
        planet: 'Jupiter',
        description: 'Jupiter · Brings wisdom, prosperity, and divine grace.',
        image_url: '/yellow-sapphire.png',
        badge: 'Jupiter Planet',
        link: '#book',
        sort_order: 3,
        is_active: true,
      },
      {
        id: 'gem-4',
        name: 'Ruby',
        planet: 'Sun',
        description: 'Sun · Amplifies leadership, vital energy, and courage.',
        image_url: '/ruby.png',
        badge: 'Sun Planet',
        link: '#book',
        sort_order: 4,
        is_active: true,
      },
      {
        id: 'gem-5',
        name: 'Amethyst',
        planet: 'Saturn',
        description: 'Saturn · Fosters spiritual calm, clarity, and intuition.',
        image_url: '/amethyst.png',
        badge: 'Saturn Planet',
        link: '#book',
        sort_order: 5,
        is_active: true,
      },
      {
        id: 'gem-6',
        name: 'Aquamarine',
        planet: 'Moon',
        description: 'Moon · Inspires tranquility, emotional healing, and balance.',
        image_url: '/aquamarine.png',
        badge: 'Moon Planet',
        link: '#book',
        sort_order: 6,
        is_active: true,
      },
    ],
    testimonials: [
      {
        id: 'test-1',
        client_name: 'Priya Mehta',
        location: 'Mumbai',
        rating: 5,
        piece_created: 'Bespoke Heirloom Ring',
        date_tag: 'Verified Custom Client',
        quote: "Kashissh turned my late mother's diamond brooch into the most exquisite heirloom ring. I wear it every day with immense pride. The craftsmanship and personal care she put into preserving every detail of the original diamonds was extraordinary.",
        image_url: '/firstpng.png',
        sort_order: 1,
        is_active: true,
      },
      {
        id: 'test-2',
        client_name: 'Ananya & Rohan',
        location: 'Delhi',
        rating: 5,
        piece_created: 'Custom Wedding Bands',
        date_tag: 'Verified Bridal Client',
        quote: 'Designing our bespoke wedding bands with Aurumm was the single best highlight of our wedding planning. The 3D CAD renders made it so effortless to visualize before crafting. The final gold polish is pure perfection.',
        image_url: '/second.png',
        sort_order: 2,
        is_active: true,
      },
      {
        id: 'test-3',
        client_name: 'Siddharth Rao',
        location: 'Bengaluru',
        rating: 5,
        piece_created: 'Astrological Gemstone Cuff',
        date_tag: 'Verified Gemstone Client',
        quote: 'The gemstone consultation gave me absolute clarity on which astrological stone aligned with my Vedic birth chart. The finished yellow sapphire cuff has brought such positive energy and looks divine.',
        image_url: '/third.png',
        sort_order: 3,
        is_active: true,
      },
      {
        id: 'test-4',
        client_name: 'Meera Kapoor',
        location: 'Jaipur',
        rating: 5,
        piece_created: 'Heritage Chandelier Earrings',
        date_tag: 'Verified Heritage Client',
        quote: 'The heritage redesign process exceeded all my expectations. Bringing modern luxury to an ancestral family piece was handled with supreme grace, transparency, and reverence.',
        image_url: '/firstpng.png',
        sort_order: 4,
        is_active: true,
      },
      {
        id: 'test-5',
        client_name: 'Vikram Shah',
        location: 'Chandigarh',
        rating: 5,
        piece_created: 'Custom Emerald Solitaire',
        date_tag: 'Verified Custom Client',
        quote: 'Extremely professional GIA gemologist insights and seamless Vedic chart alignment. The quality of emerald clarity and solid gold finish is world-class in every aspect.',
        image_url: '/second.png',
        sort_order: 5,
        is_active: true,
      },
    ],
    plans: [
      {
        id: 'plan-1',
        plan_type: 'discovery',
        label: 'The Discovery',
        price: 'Complimentary',
        description: 'A 30-minute virtual introduction to explore your ideas.',
        features: ['Virtual or in-person', 'Vision exploration', 'Style guidance'],
        cta: 'Book Free Session',
        popular: false,
        sort_order: 1,
        is_active: true,
      },
      {
        id: 'plan-2',
        plan_type: 'creation',
        label: 'The Creation',
        price: 'From ₹85,000',
        description: 'Full bespoke design service from consultation to finished piece.',
        features: [
          '60-min consultation',
          'Bespoke sketches & 3D renders',
          '3 revision rounds',
          'Gemstone sourcing',
          'Master crafting',
          'Lifetime aftercare',
        ],
        cta: 'Begin Creation',
        popular: true,
        sort_order: 2,
        is_active: true,
      },
      {
        id: 'plan-3',
        plan_type: 'heritage',
        label: 'The Heritage',
        price: 'Custom Quote',
        description: 'Complete heirloom redesign service, preserving your stones and history.',
        features: [
          'Heirloom assessment',
          'Redesign concepts',
          'Stone extraction & reuse',
          'Certificate of provenance',
        ],
        cta: 'Enquire Now',
        popular: false,
        sort_order: 3,
        is_active: true,
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('websites')
    .upsert({
      id: 'aurumm',
      name: 'Aurumm Fine Jewellery',
      domain: 'localhost:5173',
      content: contentToSeed,
      updated_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    console.error('❌ Supabase seed error:', error.message);
    process.exit(1);
  }

  console.log('✅ Successfully seeded Aurumm content into public.websites!');
  console.log('Record ID:', data[0]?.id);
  console.log('Website Name:', data[0]?.name);
  console.log('Sections:', Object.keys(data[0]?.content?.sections || {}).join(', '));
}

seedData();
