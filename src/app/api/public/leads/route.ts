import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      message,
      preferred_gemstone,
      budget_range,
      source = 'website_consultation_form',
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required fields.' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const supabase = createServerClient();

    if (!supabase) {
      // Supabase is not configured yet - log and return mock success so frontend works
      console.log('Received lead (demo mode without Supabase):', {
        name,
        email,
        phone,
        message,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Lead received in demo mode (Supabase keys not yet configured).',
          leadId: 'demo-' + Date.now(),
        },
        {
          status: 201,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          message: message?.trim() || null,
          preferred_gemstone: preferred_gemstone || null,
          budget_range: budget_range || null,
          status: 'new',
          source,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase lead insertion error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        {
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation request successfully saved to CRM.',
        lead: data,
      },
      {
        status: 201,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (err: any) {
    console.error('Lead submission exception:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
