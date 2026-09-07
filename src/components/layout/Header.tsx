'use client';

import React from 'react';
import { Sparkles, Bell, ShieldCheck, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const isConnected = isSupabaseConfigured();

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
        {/* Supabase status badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
          title={
            isConnected
              ? 'Connected to Supabase'
              : 'Running in Local Fallback mode (Supabase keys not configured)'
          }
        >
          <Database className="w-3 h-3" />
          <span>{isConnected ? 'Supabase Active' : 'Demo / Local Mode'}</span>
        </div>

        {action}
      </div>
    </header>
  );
}
