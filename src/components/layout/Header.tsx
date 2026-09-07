'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {

  return (
    <header className="px-8 py-6 border-b border-neutral-800/80 bg-[#0a0a0c]/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}
      </div>
    </header>
  );
}
