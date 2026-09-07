'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Gem,
  ExternalLink,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { INITIAL_DEMO_LEADS } from '@/lib/default-content';
import { Lead } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_DEMO_LEADS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

          if (!error && data && data.length > 0) {
            setLeads(data);
          }
        } catch (e) {
          console.error('Error fetching leads from Supabase:', e);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const scheduledCount = leads.filter((l) => l.status === 'scheduled').length;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Aurumm Executive Dashboard"
        subtitle="Overview of bespoke consultation requests and live website content"
        action={
          <Link
            href="/content"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#b8952a] via-[#d4af37] to-[#f0d060] text-black shadow-lg shadow-[#d4af37]/20 hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Website Content</span>
          </Link>
        }
      />

      <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-[#d4af37]/40 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl group-hover:bg-[#d4af37]/10 transition-all"></div>
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Inquiries
              </span>
              <div className="p-2 rounded-xl bg-neutral-800/80 text-[#d4af37]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-white font-serif">
              {leads.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>{newLeadsCount} new this week</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-[#d4af37]/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">
                Action Required
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-amber-400 font-serif">
              {newLeadsCount}
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Awaiting consultant response
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-[#d4af37]/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">
                Scheduled Consultations
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-purple-300 font-serif">
              {scheduledCount}
            </div>
            <p className="text-xs text-neutral-500 mt-2">Studio & virtual appointments</p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-[#d4af37]/40 transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">
                Managed Content
              </span>
              <div className="p-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-[#f5e6a3] font-serif">
              10 Sections
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Hero, Gems, Founder, Collections, etc.
            </p>
          </div>
        </div>

        {/* Content Management Quick Access */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                Website Content & Image CMS
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Update texts, titles, and upload images for any section in the frontend repository
              </p>
            </div>
            <Link
              href="/content"
              className="text-xs font-medium text-[#d4af37] hover:text-[#f5e6a3] flex items-center gap-1 transition-colors"
            >
              <span>View all sections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: 'hero', name: 'Hero Section', desc: 'Title & Spotlight' },
              { id: 'collections', name: 'Collections', desc: 'Shop Grid Items' },
              { id: 'philosophy', name: 'Philosophy', desc: 'Story & Stats' },
              { id: 'founder', name: 'Founder', desc: 'Portrait & Bio' },
              { id: 'heritage', name: 'Heritage', desc: 'Before/After Slider' },
              { id: 'gemstones', name: 'Gemstones', desc: 'Gems & Planets' },
            ].map((section) => (
              <Link
                key={section.id}
                href={`/content?section=${section.id}`}
                className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-[#d4af37]/50 hover:bg-neutral-900/80 transition-all text-left group"
              >
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-[#f5e6a3] transition-colors">
                  {section.name}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  {section.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Consultation Requests */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#d4af37]" />
                Recent Consultation Leads
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Submissions from the Aurumm website booking form
              </p>
            </div>
            <Link
              href="/leads"
              className="text-xs font-medium text-[#d4af37] hover:text-[#f5e6a3] flex items-center gap-1 transition-colors"
            >
              <span>Manage all leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
                <tr>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Interest / Gem</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-medium text-neutral-200">{lead.name}</div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                        {lead.message || 'No custom notes provided'}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-neutral-400">
                      <div>{lead.email}</div>
                      <div className="text-neutral-500 font-mono text-[11px] mt-0.5">
                        {lead.phone}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-neutral-300">
                      {lead.preferred_gemstone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 text-xs">
                          <Gem className="w-3 h-3 text-[#d4af37]" />
                          {lead.preferred_gemstone}
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-xs">General Inquiry</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                          lead.status === 'new'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : lead.status === 'scheduled'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : lead.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/leads?id=${lead.id}`}
                        className="text-xs font-medium text-[#d4af37] hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
