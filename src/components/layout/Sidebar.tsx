'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ShoppingBag,
  Compass,
  Crown,
  Palette,
  History,
  Gem,
  MessageSquareQuote,
  CalendarCheck,
  Mail,
  ExternalLink,
} from 'lucide-react';

export const CONTENT_SECTIONS = [
  { id: 'hero', label: 'Hero Spotlight', num: '01', icon: Sparkles },
  { id: 'collections', label: 'Shop Collections', num: '02', icon: ShoppingBag },
  { id: 'philosophy', label: 'Brand Philosophy', num: '03', icon: Compass },
  { id: 'founder', label: 'Meet The Founder', num: '04', icon: Crown },
  { id: 'custom', label: 'Custom Jewellery', num: '05', icon: Palette },
  { id: 'heritage', label: 'Heritage Redesign', num: '06', icon: History },
  { id: 'gemstones', label: 'Gemstones Showcase', num: '07', icon: Gem },
  { id: 'testimonials', label: 'Client Stories', num: '08', icon: MessageSquareQuote },
  { id: 'plans', label: 'Consultation Plans', num: '09', icon: CalendarCheck },
  { id: 'footer', label: 'Footer & Contact', num: '10', icon: Mail },
];

function SidebarNav() {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'hero';

  return (
    <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
      <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
        Website Sections
      </div>

      {CONTENT_SECTIONS.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;

        return (
          <Link
            key={item.id}
            href={`/?section=${item.id}`}
            scroll={false}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
              isActive
                ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/10 to-transparent text-[#f5e6a3] border-l-2 border-[#d4af37] shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#d4af37]'
                    : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>
            <span
              className={`text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded transition-colors ${
                isActive
                  ? 'text-[#d4af37] bg-[#d4af37]/15 font-semibold'
                  : 'text-neutral-600 group-hover:text-neutral-500'
              }`}
            >
              {item.num}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0a0c] border-r border-neutral-800/80 flex flex-col shrink-0 min-h-screen sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#997825] via-[#d4af37] to-[#f5e6a3] p-0.5 shadow-lg shadow-[#d4af37]/10 flex items-center justify-center">
            <div className="w-full h-full bg-[#0e0e11] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#d4af37] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wider text-[#faf7f0] uppercase font-serif">
              AURUMM
            </h1>
            <p className="text-[10px] tracking-widest text-[#d4af37] uppercase font-mono">
              Content Studio
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <Suspense
        fallback={
          <div className="flex-1 p-4 text-xs text-neutral-500">Loading navigation...</div>
        }
      >
        <SidebarNav />
      </Suspense>

      {/* Frontend Website Link / Quick View */}
      <div className="p-3.5 border-t border-neutral-800/80">
        <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium text-neutral-300 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Storefront
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Aurumm</span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-snug">
            Edits update the live Aurumm website in real-time.
          </p>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 text-xs font-medium text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
