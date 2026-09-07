-- Aurumm CRM & Website Initial Seed Data
-- Execute this after schema.sql

-- 1. Site Content Sections
insert into public.site_content (id, section_name, title, subtitle, description, image_url, data)
values
(
    'hero',
    'Hero Section',
    'DESIGNED FOR YOUR LEGACY',
    'Where Artistry meets Meaning',
    'Every piece we create begins with your story. Handcrafted with ethically sourced gemstones and timeless craft, jewellery that endures.',
    '/hero.png',
    '{"heading_line1": "DESIGNED FOR", "heading_line2": "YOUR LEGACY", "cta1_label": "DISCOVER OUR CREATIONS", "cta1_link": "#shop", "cta2_label": "BOOK A PRIVATE CONSULTATION", "cta2_link": "#book"}'::jsonb
),
(
    'philosophy',
    'Our Philosophy',
    'where Artistry meets Meaning',
    'Our Philosophy',
    'We believe jewellery is not merely an ornament — it is an intimate expression of identity, heritage, and memory. Each piece is crafted with reverence, honouring rare gemstones and timeless artisanal mastery.',
    '/PHILOSOPHY_1.png',
    '{"stats": [{"value": "500+", "label": "Bespoke Pieces Created"}, {"value": "100%", "label": "Ethically Sourced Gems"}, {"value": "15+", "label": "Countries Served"}, {"value": "5★", "label": "Client Satisfaction"}]}'::jsonb
),
(
    'founder',
    'Meet the Founder',
    'Meet the Founder',
    'The Visionary',
    'With over a decade of dedicated expertise in gemology and high jewellery design, Pooja Roy envisions jewellery as wearable sacred art. Every commission is personally overseen from rough gem sourcing to final polish.',
    '/Poojaroy.png',
    '{"founder_name": "Pooja Roy", "founder_title": "Founder & Master Gemologist", "quote": "True luxury is born when fine craft honors nature''s most extraordinary gifts and personal histories.", "expertise": ["GIA Certified Gemologist", "Vedic Astrology", "3D CAD Design", "Ethical Sourcing"]}'::jsonb
),
(
    'heritage',
    'Heritage Redesign',
    'Honouring the Past, Reimagining the Future',
    'Heritage Redesign',
    'Transform your treasured ancestral jewellery into contemporary masterpieces while preserving their emotional essence and original gemstones.',
    '/earring-1.png',
    '{"before_image": "/earring-1.png", "after_image": "/ear ring after design.png", "features": ["Full assessment & valuation of your heirloom", "Hand-drawn redesign concepts for your approval", "Careful stone extraction and reuse", "Photographic documentation throughout", "Certificate of provenance with finished piece"]}'::jsonb
),
(
    'footer',
    'Footer & Contact Info',
    'Aurumm Studio',
    'Bespoke Fine Jewellery',
    'Creating modern heirlooms and astrological fine jewellery for those who value meaning as much as beauty.',
    '/Logo.png',
    '{"phone": "+91 9315574332", "email": "aurumm.designstudio@gmail.com", "alt_email": "tnavin989@gmail.com", "address": "Aurumm Design Studio, New Delhi, India", "instagram": "https://instagram.com", "whatsapp": "+919315574332"}'::jsonb
)
on conflict (id) do update set
    section_name = excluded.section_name,
    title = excluded.title,
    subtitle = excluded.subtitle,
    description = excluded.description,
    image_url = excluded.image_url,
    data = excluded.data,
    updated_at = now();

-- 2. Collections (Shop Grid)
insert into public.collections (title, description, image_url, badge, link, sort_order)
values
('Engagement Rings', 'Sacred promises set in solid gold and GIA certified diamonds.', '/Engagement Rings.png', 'Bridal Collection', '#custom', 1),
('Statement Necklaces', 'Command any room with handcrafted luxury statement pieces.', '/Statement Necklaces.png', 'Haute Joaillerie', '#custom', 2),
('Heirloom Pieces', 'Redesigned with reverence for your ancestral gemstones.', '/Heirloom Pieces.png', 'Heritage Redesign', '#heritage', 3),
('Everyday Luxury', 'Refined, lightweight gold jewelry for daily elegance.', '/Everyday Luxury.png', 'Essential Edit', '#custom', 4),
('Gemstone Cuffs', 'Astrologically guided natural gems aligned with Vedic charts.', '/Gemstone Cuffs.png', 'Astrology Guided', '#gemstone', 5);

-- 3. Custom Jewellery Categories
insert into public.custom_categories (title, description, image_url, badge, link, sort_order)
values
('Engagement & Wedding', 'Rings, bands, and bridal sets crafted to mark life''s most sacred promises.', '/Engagement & Wedding.png', 'Bespoke Bridal', '#book', 1),
('Statement Pieces', 'Bold necklaces, chandelier earrings, and cuffs designed to command attention.', '/Statement Pieces.png', 'Haute Joaillerie', '#book', 2),
('Everyday Luxury', 'Refined pieces for daily wear — elegant enough for any occasion.', '/Everyday Luxury.png', 'Daily Luxury', '#book', 3);

-- 4. Gemstones Showcase
insert into public.gemstones (name, planet, description, image_url, badge, link, sort_order)
values
('Blue Sapphire', 'Saturn', 'Saturn · Resonates with discipline, focus, and inner authority.', '/blue-sapphire.png', 'Saturn Planet', '#book', 1),
('Emerald', 'Mercury', 'Mercury · Enhances communication, intellect, and wealth.', '/emerald.png', 'Mercury Planet', '#book', 2),
('Yellow Sapphire', 'Jupiter', 'Jupiter · Brings wisdom, prosperity, and divine grace.', '/yellow-sapphire.png', 'Jupiter Planet', '#book', 3),
('Ruby', 'Sun', 'Sun · Amplifies leadership, vital energy, and courage.', '/ruby.png', 'Sun Planet', '#book', 4),
('Amethyst', 'Saturn', 'Saturn · Fosters spiritual calm, clarity, and intuition.', '/amethyst.png', 'Saturn Planet', '#book', 5),
('Aquamarine', 'Moon', 'Moon · Inspires tranquility, emotional healing, and balance.', '/aquamarine.png', 'Moon Planet', '#book', 6);

-- 5. Testimonials
insert into public.testimonials (client_name, location, rating, piece_created, date_tag, quote, image_url, sort_order)
values
('Priya Mehta', 'Mumbai', 5, 'Bespoke Heirloom Ring', 'Verified Custom Client', 'Kashissh turned my late mother''s diamond brooch into the most exquisite heirloom ring. I wear it every day with immense pride. The craftsmanship and personal care she put into preserving every detail of the original diamonds was extraordinary.', '/firstpng.png', 1),
('Ananya & Rohan', 'Delhi', 5, 'Custom Wedding Bands', 'Verified Bridal Client', 'Designing our bespoke wedding bands with Aurumm was the single best highlight of our wedding planning. The 3D CAD renders made it so effortless to visualize before crafting. The final gold polish is pure perfection.', '/second.png', 2),
('Siddharth Rao', 'Bengaluru', 5, 'Astrological Gemstone Cuff', 'Verified Gemstone Client', 'The gemstone consultation gave me absolute clarity on which astrological stone aligned with my Vedic birth chart. The finished yellow sapphire cuff has brought such positive energy and looks divine.', '/third.png', 3),
('Meera Kapoor', 'Jaipur', 5, 'Heritage Chandelier Earrings', 'Verified Heritage Client', 'The heritage redesign process exceeded all my expectations. Bringing modern luxury to an ancestral family piece was handled with supreme grace, transparency, and reverence.', '/firstpng.png', 4),
('Vikram Shah', 'Chandigarh', 5, 'Custom Emerald Solitaire', 'Verified Custom Client', 'Extremely professional GIA gemologist insights and seamless Vedic chart alignment. The quality of emerald clarity and solid gold finish is world-class in every aspect.', '/second.png', 5);

-- 6. Plans / Consultation Tiers
insert into public.plans (plan_type, label, price, description, features, cta, popular, sort_order)
values
('discovery', 'The Discovery', 'Complimentary', 'A 30-minute virtual introduction to explore your ideas.', '["Virtual or in-person", "Vision exploration", "Style guidance"]'::jsonb, 'Book Free Session', false, 1),
('creation', 'The Creation', 'From ₹85,000', 'Full bespoke design service from consultation to finished piece.', '["60-min consultation", "Bespoke sketches & 3D renders", "3 revision rounds", "Gemstone sourcing", "Master crafting", "Lifetime aftercare"]'::jsonb, 'Begin Creation', true, 2),
('heritage', 'The Heritage', 'Custom Quote', 'Complete heirloom redesign service, preserving your stones and history.', '["Heirloom assessment", "Redesign concepts", "Stone extraction & reuse", "Certificate of provenance"]'::jsonb, 'Enquire Now', false, 3);

-- 7. Sample Initial Leads (for CRM Preview)
insert into public.leads (name, email, phone, message, status, preferred_gemstone, budget_range, consultant_notes)
values
('Radhika Sharma', 'radhika.s@example.com', '+91 9876543210', 'Looking for a bespoke emerald ring for our 10th anniversary.', 'new', 'Emerald', '₹1,50,000 - ₹2,50,000', 'Interested in Colombian emerald with certificate.'),
('Arjun Kapoor', 'arjun.kapoor@example.com', '+91 9811223344', 'Need Vedic consultation for Blue Sapphire cuff in 18k yellow gold.', 'contacted', 'Blue Sapphire', '₹2,00,000+', 'Initial call scheduled for Wednesday 4pm.'),
('Kavita Singhania', 'kavita@singhania.org', '+91 9920033445', 'Have heirloom polki necklace that needs modern redesign.', 'scheduled', 'Diamond & Polki', 'Custom', 'In-person studio consultation booked.');
