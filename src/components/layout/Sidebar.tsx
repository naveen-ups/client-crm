'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Image as ImageIcon,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Leads & Consultations',
    href: '/leads',
    icon: Users,
    badge: '3',
  },
  {
    label: 'Website Content & CMS',
    href: '/content',
    icon: FileText,
  },
  {
    label: 'Media Library',
    href: '/media',
    icon: ImageIcon,
  },
  {
    label: 'Settings & Supabase',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a0c] border-r border-neutral-800/80 flex flex-col shrink-0 min-h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-neutral-800/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#997825] via-[#d4af37] to-[#f5e6a3] p-0.5 shadow-lg shadow-[#d4af37]/10 flex items-center justify-center">
            <div className="w-full h-full bg-[#0e0e11] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#d4af37] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-base tracking-wider text-[#faf7f0] uppercase font-serif">
              AURUMM
            </h1>
            <p className="text-[10px] tracking-widest text-[#d4af37] uppercase font-mono">
              CRM & Content Studio
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
          Management
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37]/15 to-transparent text-[#f5e6a3] border-l-2 border-[#d4af37]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-[#d4af37]'
                      : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Frontend Website Link / Quick View */}
      <div className="p-4 border-t border-neutral-800/80">
        <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Storefront
            </span>
            <span className="text-[10px] text-neutral-500">React + Vite</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Content edits in this CRM reflect on the Aurumm website in real-time.
          </p>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 text-xs font-medium text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg transition-colors"
          >
            <span>Open Website (5173)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
