'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useSite } from '@/context/SiteContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { setIsMobileNavOpen } = useSite();

  return (
    <header className="px-4 sm:px-8 py-3.5 sm:py-5 border-b border-neutral-800/80 bg-[#0a0a0c]/90 backdrop-blur-md sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 w-full">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-1 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#d4af37]/40 transition-colors shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4 text-[#d4af37]" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-xl font-semibold text-neutral-100 flex items-center gap-2 truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end shrink-0">
        {action}
      </div>
    </header>
  );
}
