'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useSite } from '@/context/SiteContext';
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
  X,
  LogOut,
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

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
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
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
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

function SidebarBody({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const { activeSiteName, activeSiteId, currentUser, handleSignOut } = useSite();

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-800/80 flex items-center justify-between gap-2 shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group min-w-0 flex-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#997825] via-[#d4af37] to-[#f5e6a3] p-0.5 shadow-lg shadow-[#d4af37]/10 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0e0e11] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#d4af37] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1
              className="font-semibold text-sm tracking-wider text-[#faf7f0] uppercase font-serif truncate"
              title={activeSiteName}
            >
              {activeSiteName}
            </h1>
            <p className="text-[10px] tracking-widest text-[#d4af37] uppercase font-mono truncate">
              Content Studio
            </p>
          </div>
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <Suspense
        fallback={
          <div className="flex-1 p-4 text-xs text-neutral-500">
            Loading navigation...
          </div>
        }
      >
        <SidebarNav onNavigate={onClose} />
      </Suspense>

      {/* Sidebar Footer: Website & User Info + Sign Out */}
      <div className="p-3.5 border-t border-neutral-800/80 bg-neutral-950/80 mt-auto space-y-2 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs min-w-0">
          <span className="font-semibold lowercase tracking-wide text-xs text-[#d4af37] shrink-0">
            {activeSiteId || currentUser?.siteId || 'aurumm'}
          </span>
          <span className="text-neutral-500 shrink-0">•</span>
          <span
            className="text-neutral-300 font-mono text-[11px] truncate min-w-0 flex-1"
            title={currentUser?.email || 'admin@aurumm.com'}
          >
            {currentUser?.email || 'admin@aurumm.com'}
          </span>
        </div>

        <button
          type="button"
          onClick={async () => {
            if (onClose) onClose();
            await handleSignOut();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-red-400 bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/30 transition-all cursor-pointer group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isMobileNavOpen, setIsMobileNavOpen } = useSite();

  if (pathname === '/login') return null;

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-neutral-800/80 flex-col shrink-0 h-full">
        <SidebarBody />
      </aside>

      {/* Mobile Sliding Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Mobile Sliding Drawer Sheet */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-neutral-800 lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarBody isMobile onClose={() => setIsMobileNavOpen(false)} />
      </div>
    </>
  );
}
