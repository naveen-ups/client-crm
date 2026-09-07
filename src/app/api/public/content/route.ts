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
    // Return default content if Supabase is not configured yet
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
    // 1. First priority: Check single multi-tenant `websites` table with JSONB
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

    // 2. Fallback for backward compatibility: Legacy relational tables
    const [
      sectionsRes,
      collectionsRes,
      customCategoriesRes,
      gemstonesRes,
      testimonialsRes,
      plansRes,
    ] = await Promise.all([
      supabase.from('site_content').select('*'),
      supabase
        .from('collections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('custom_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('gemstones')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);

    // Format sections as map by id
    const sectionsMap: Record<string, any> = { ...DEFAULT_SITE_SECTIONS };
    if (sectionsRes.data && sectionsRes.data.length > 0) {
      sectionsRes.data.forEach((item) => {
        sectionsMap[item.id] = item;
      });
    }

    return NextResponse.json(
      {
        source: 'supabase_relational',
        siteId,
        sections: sectionsMap,
        collections: collectionsRes.data?.length
          ? collectionsRes.data
          : DEFAULT_COLLECTIONS,
        customCategories: customCategoriesRes.data?.length
          ? customCategoriesRes.data
          : DEFAULT_CUSTOM_CATEGORIES,
        gemstones: gemstonesRes.data?.length
          ? gemstonesRes.data
          : DEFAULT_GEMSTONES,
        testimonials: testimonialsRes.data?.length
          ? testimonialsRes.data
          : DEFAULT_TESTIMONIALS,
        plans: plansRes.data?.length ? plansRes.data : DEFAULT_PLANS,
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
