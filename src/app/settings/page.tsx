'use client';

import React, { useState } from 'react';
import {
  Database,
  Key,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Code,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const isConnected = isSupabaseConfigured();

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envSample = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`;

  const frontendFetchSample = `// aurumm_website2: Fetching live dynamic content from the CRM:
const response = await fetch('http://localhost:3000/api/public/content');
const { sections, collections, gemstones } = await response.json();

// Submitting consultation requests directly to CRM:
await fetch('http://localhost:3000/api/public/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Client Name',
    email: 'client@example.com',
    phone: '+91 9315574332',
    message: 'Interested in bespoke emerald ring',
  }),
});`;

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Settings & Supabase Configuration"
        subtitle="Environment credentials, database status, and website synchronization"
      />

      <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* Status card */}
        <div
          className={`p-6 rounded-2xl border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isConnected
                  ? 'Supabase Successfully Connected'
                  : 'Running in Local Demo Mode'}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {isConnected
                  ? 'Your CRM is syncing with your live Supabase database and storage bucket.'
                  : 'Supabase environment variables are not yet configured in .env.local. The CRM is running safely with built-in default content so you can test all features immediately.'}
              </p>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#d4af37]" />
            Quick Setup Guide (4 Steps)
          </h3>

          <div className="space-y-4 text-xs text-neutral-300">
            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <p className="font-semibold text-white">Create a Supabase Project</p>
                <p className="text-neutral-400 mt-0.5">
                  Go to{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#d4af37] hover:underline inline-flex items-center gap-1"
                  >
                    supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and create a new project.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">Run SQL Schema & Seed</p>
                <p className="text-neutral-400 mt-0.5">
                  Open the Supabase SQL Editor and execute{' '}
                  <code className="text-[#f5e6a3]">supabase/schema.sql</code> and{' '}
                  <code className="text-[#f5e6a3]">supabase/seed.sql</code> located in this project.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">Set Environment Variables</p>
                <p className="text-neutral-400 mt-0.5 mb-2">
                  Create a <code className="text-white">.env.local</code> file in{' '}
                  <code className="text-neutral-300">client-crm</code>:
                </p>
                <div className="relative p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300">
                  <pre>{envSample}</pre>
                  <button
                    onClick={() => copyText(envSample, 'env')}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    {copiedKey === 'env' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <div>
                <p className="font-semibold text-white">Restart Development Server</p>
                <p className="text-neutral-400 mt-0.5">
                  Restart Next.js with <code className="text-white">npm run dev</code> to connect to live Supabase!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Frontend Connection Code */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-[#d4af37]" />
                Frontend Connection Integration
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                How `aurumm_website2` connects to this CRM API
              </p>
            </div>
            <button
              onClick={() => copyText(frontendFetchSample, 'fetch')}
              className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-medium"
            >
              {copiedKey === 'fetch' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-[#f5e6a3] overflow-x-auto leading-relaxed">
            <pre>{frontendFetchSample}</pre>
          </div>
        </div>
      </main>
    </div>
  );
}
