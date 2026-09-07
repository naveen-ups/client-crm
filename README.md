# Aurumm CRM & Website Content Studio

A Next.js & Supabase full-stack CRM and Headless CMS built for **Aurumm Luxury Jewellery & Gemstone Studio**.

---

## Features

1. **Executive CRM Dashboard** (`/`)
   - High-level KPIs: Total Inquiries, Pending Actions, Scheduled Consultations, and Live Content Sections.
   - Real-time recent leads table with quick status badges.

2. **Lead & Consultation Pipeline** (`/leads`)
   - Ingestion of consultation requests from the `aurumm_website2` booking form.
   - Status pipeline: `New` ➔ `Contacted` ➔ `Scheduled` ➔ `In Progress` ➔ `Converted` ➔ `Archived`.
   - Direct communication shortcuts: **WhatsApp**, **Direct Call**, and **Email**.
   - Consultant internal notes editor for recording gemstone preferences, budgets, and Vedic astrology charts.
   - Manual In-Studio / Phone Lead entry modal.

3. **10-Section Website Content & Image Studio** (`/content`)
   - **Hero Section**: Eyebrow, headings, tagline, CTAs, and ambient image.
   - **Shop Collections**: Add/edit/delete collections with custom card badges and image uploads.
   - **Brand Philosophy**: Story paragraphs, 4 key statistics, and 3D frame photo.
   - **Founder Story**: Portrait image, title, quote, bio, and expertise pills.
   - **Custom Jewellery**: Categories, descriptions, and imagery.
   - **Heritage Redesign**: Headline, before/after images, and service checklist.
   - **Gemstones Showcase**: Astrological gemstones, planetary alignments, and gem images.
   - **Client Testimonials**: Client reviews, ratings, and customer piece photos.
   - **Consultation Plans**: Pricing tiers, features, and popularity badges.
   - **Footer & Contact**: Direct phone, email, studio address, and social links.

4. **Media & Storage Library** (`/media`)
   - Direct upload to Supabase Storage bucket (`aurumm-media`).
   - One-click **Copy CDN URL** for seamless insertion into content sections.

5. **Settings & Documentation** (`/settings`)
   - Live Supabase connection status check.
   - Quick setup instructions and SQL scripts.

---

## Supabase Setup (3 Steps)

1. **Run SQL Migrations**:
   In your Supabase project's SQL Editor, execute:
   - `supabase/schema.sql` (Creates tables, storage bucket, and RLS policies)
   - `supabase/seed.sql` (Inserts initial Aurumm copy, collections, and sample leads)

2. **Configure Environment Variables**:
   Create `.env.local` in `client-crm/`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The CRM will run on `http://localhost:3000`.

---

## Connecting `aurumm_website2`

- **Content API**: `GET http://localhost:3000/api/public/content`
- **Leads API**: `POST http://localhost:3000/api/public/leads`

The frontend repository `aurumm_website2` is pre-configured with `ContentProvider` to automatically sync with the CRM whenever changes are published.
