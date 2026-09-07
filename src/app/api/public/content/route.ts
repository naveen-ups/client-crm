import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import {
  DEFAULT_COLLECTIONS,
  DEFAULT_CUSTOM_CATEGORIES,
  DEFAULT_GEMSTONES,
  DEFAULT_PLANS,
  DEFAULT_SITE_SECTIONS,
  DEFAULT_TESTIMONIALS,
} from '@/lib/default-content';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('site') || 'aurumm';

  if (!supabase) {
    // Return default content if Supabase is not configured
    return NextResponse.json(
      {
        source: 'default',
        siteId,
        sections: DEFAULT_SITE_SECTIONS,
        collections: DEFAULT_COLLECTIONS,
        customCategories: DEFAULT_CUSTOM_CATEGORIES,
        gemstones: DEFAULT_GEMSTONES,
        testimonials: DEFAULT_TESTIMONIALS,
        plans: DEFAULT_PLANS,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }

  try {
    // Query single multi-tenant `websites` table with JSONB
    const { data: website, error: siteError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', siteId)
      .maybeSingle();

    if (website && website.content && Object.keys(website.content).length > 0) {
      const content = website.content;
      return NextResponse.json(
        {
          source: 'supabase_jsonb',
          siteId: website.id,
          siteName: website.name,
          sections: content.sections || DEFAULT_SITE_SECTIONS,
          collections: content.collections || DEFAULT_COLLECTIONS,
          customCategories: content.customCategories || DEFAULT_CUSTOM_CATEGORIES,
          gemstones: content.gemstones || DEFAULT_GEMSTONES,
          testimonials: content.testimonials || DEFAULT_TESTIMONIALS,
          plans: content.plans || DEFAULT_PLANS,
          updatedAt: website.updated_at || content.updatedAt || new Date().toISOString(),
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          },
        }
      );
    }

    // Fallback to default if requested site was not found
    return NextResponse.json(
      {
        source: 'default',
        siteId,
        sections: DEFAULT_SITE_SECTIONS,
        collections: DEFAULT_COLLECTIONS,
        customCategories: DEFAULT_CUSTOM_CATEGORIES,
        gemstones: DEFAULT_GEMSTONES,
        testimonials: DEFAULT_TESTIMONIALS,
        plans: DEFAULT_PLANS,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('Failed to fetch content from Supabase:', error);
    return NextResponse.json(
      {
        source: 'fallback',
        siteId,
        error: error.message,
        sections: DEFAULT_SITE_SECTIONS,
        collections: DEFAULT_COLLECTIONS,
        customCategories: DEFAULT_CUSTOM_CATEGORIES,
        gemstones: DEFAULT_GEMSTONES,
        testimonials: DEFAULT_TESTIMONIALS,
        plans: DEFAULT_PLANS,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
