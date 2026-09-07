-- Aurumm CRM & Website CMS Schema
-- Execute this file in your Supabase SQL Editor

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. General Site Sections (Hero, Philosophy, Founder, Heritage, Footer, etc.)
create table if not exists public.site_content (
    id text primary key, -- 'hero', 'philosophy', 'founder', 'heritage', 'footer'
    section_name text not null,
    title text,
    subtitle text,
    description text,
    image_url text,
    data jsonb default '{}'::jsonb, -- flexible structure for stats, badges, extra copy
    updated_at timestamptz default now()
);

-- 3. Collections (Shop Grid)
create table if not exists public.collections (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    image_url text,
    badge text,
    link text default '#custom',
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Custom Jewellery Categories
create table if not exists public.custom_categories (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    image_url text,
    badge text,
    link text default '#book',
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 5. Gemstones Showcase
create table if not exists public.gemstones (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    planet text,
    description text,
    image_url text,
    badge text,
    link text default '#book',
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 6. Testimonials Deck
create table if not exists public.testimonials (
    id uuid primary key default gen_random_uuid(),
    client_name text not null,
    location text,
    rating int default 5,
    piece_created text,
    date_tag text default 'Verified Client',
    quote text not null,
    image_url text,
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 7. Plans / Consultation Tiers
create table if not exists public.plans (
    id uuid primary key default gen_random_uuid(),
    plan_type text not null, -- 'discovery', 'creation', 'heritage'
    label text not null,
    price text not null,
    description text,
    features jsonb default '[]'::jsonb,
    cta text default 'Book Session',
    popular boolean default false,
    sort_order int default 0,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 8. Leads / Book Consultations (CRM Core)
create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    phone text not null,
    message text,
    status text default 'new', -- 'new', 'contacted', 'scheduled', 'in_progress', 'converted', 'archived'
    preferred_gemstone text,
    budget_range text,
    consultant_notes text,
    source text default 'website_consultation_form',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 9. Storage Bucket for Media Assets
insert into storage.buckets (id, name, public)
values ('aurumm-media', 'aurumm-media', true)
on conflict (id) do update set public = true;

-- 10. Enable Row Level Security (RLS)
alter table public.site_content enable row level security;
alter table public.collections enable row level security;
alter table public.custom_categories enable row level security;
alter table public.gemstones enable row level security;
alter table public.testimonials enable row level security;
alter table public.plans enable row level security;
alter table public.leads enable row level security;

-- Public Read Policies for website visitors & frontend
create policy "Allow public read site_content" on public.site_content for select using (true);
create policy "Allow public read collections" on public.collections for select using (is_active = true);
create policy "Allow public read custom_categories" on public.custom_categories for select using (is_active = true);
create policy "Allow public read gemstones" on public.gemstones for select using (is_active = true);
create policy "Allow public read testimonials" on public.testimonials for select using (is_active = true);
create policy "Allow public read plans" on public.plans for select using (is_active = true);

-- Public Insert Policy for Leads (from consultation form)
create policy "Allow public lead creation" on public.leads for insert with check (true);

-- Admin / Full access Policies
create policy "Allow full access to site_content" on public.site_content for all using (true) with check (true);
create policy "Allow full access to collections" on public.collections for all using (true) with check (true);
create policy "Allow full access to custom_categories" on public.custom_categories for all using (true) with check (true);
create policy "Allow full access to gemstones" on public.gemstones for all using (true) with check (true);
create policy "Allow full access to testimonials" on public.testimonials for all using (true) with check (true);
create policy "Allow full access to plans" on public.plans for all using (true) with check (true);
create policy "Allow full access to leads" on public.leads for all using (true) with check (true);

-- Storage bucket access policy
create policy "Public Access aurumm-media" on storage.objects
for select using (bucket_id = 'aurumm-media');

create policy "Allow uploads to aurumm-media" on storage.objects
for insert with check (bucket_id = 'aurumm-media');

create policy "Allow updates to aurumm-media" on storage.objects
for update using (bucket_id = 'aurumm-media');

create policy "Allow deletes from aurumm-media" on storage.objects
for delete using (bucket_id = 'aurumm-media');
