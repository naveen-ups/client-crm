'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { uploadMediaAsset, BUCKET_NAME } from '@/lib/supabase/storage';

interface MediaAsset {
  name: string;
  url: string;
  created_at?: string | null;
  size?: number;
}

const SAMPLE_ASSETS: MediaAsset[] = [
  { name: 'hero.png', url: '/hero.png' },
  { name: 'PHILOSOPHY_1.png', url: '/PHILOSOPHY_1.png' },
  { name: 'Poojaroy.png', url: '/Poojaroy.png' },
  { name: 'Engagement Rings.png', url: '/Engagement Rings.png' },
  { name: 'Statement Necklaces.png', url: '/Statement Necklaces.png' },
  { name: 'Heirloom Pieces.png', url: '/Heirloom Pieces.png' },
  { name: 'blue-sapphire.png', url: '/blue-sapphire.png' },
  { name: 'emerald.png', url: '/emerald.png' },
  { name: 'ruby.png', url: '/ruby.png' },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(SAMPLE_ASSETS);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchBucketAssets = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list('content', {
        limit: 50,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && data && data.length > 0) {
        const mapped: MediaAsset[] = data.map((item) => {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`content/${item.name}`);
          return {
            name: item.name,
            url: publicUrlData.publicUrl,
            created_at: item.created_at,
          };
        });
        setAssets([...mapped, ...SAMPLE_ASSETS]);
      }
    } catch (err) {
      console.error('Failed to list media:', err);
    }
  };

  useEffect(() => {
    fetchBucketAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadMediaAsset(file, 'library');
    setIsUploading(false);

    if (res.url) {
      setAssets((prev) => [
        { name: file.name, url: res.url, created_at: new Date().toISOString() },
        ...prev,
      ]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Supabase Media & Asset Library"
        subtitle="Upload high-res jewellery photography, CAD models, and campaign graphics directly to CDN"
        action={
          <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#d4af37] text-black hover:bg-[#b8952a] transition-colors cursor-pointer">
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        }
      />

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            Click &apos;Copy URL&apos; on any image to paste it into any section or collection.
          </p>
          <button
            onClick={fetchBucketAssets}
            className="text-xs text-neutral-400 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Storage</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset, index) => (
            <div
              key={index}
              className="group p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-[#d4af37]/50 transition-all flex flex-col"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-black/40 border border-neutral-800/60 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/200x200/18181b/d4af37?text=Jewel+Asset';
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <p className="text-[11px] font-medium text-neutral-200 truncate">
                  {asset.name}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60">
                  <button
                    onClick={() => copyToClipboard(asset.url)}
                    className="text-[11px] text-[#d4af37] hover:text-[#f5e6a3] flex items-center gap-1 font-medium transition-colors"
                  >
                    {copiedUrl === asset.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-neutral-300"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
