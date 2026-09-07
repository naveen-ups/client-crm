'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { uploadMediaAsset } from '@/lib/supabase/storage';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: string;
  recommendedSize?: string;
}

export function ImageUploader({
  label = 'Image',
  value,
  onChange,
  folder = 'content',
  recommendedSize = 'e.g. 1200x800px',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const res = await uploadMediaAsset(file, folder);
    setIsUploading(false);

    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      onChange(res.url);
      setCustomUrl(res.url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-[#d4af37]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-neutral-400 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Upload file instead' : 'Enter URL / Local path'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="/images/example.png or https://..."
            className="flex-1 px-3 py-2 text-sm bg-neutral-900/90 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
          />
          {customUrl && (
            <button
              type="button"
              onClick={() => {
                setCustomUrl('');
                onChange('');
              }}
              className="p-2 text-neutral-400 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] text-center ${
            isDragging
              ? 'border-[#d4af37] bg-[#d4af37]/10'
              : 'border-neutral-800 hover:border-[#d4af37]/50 bg-neutral-900/50 hover:bg-neutral-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
              <span className="text-xs">Uploading image...</span>
            </div>
          ) : value ? (
            <div className="flex items-center gap-4 w-full">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-black/40 border border-neutral-800 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/200x200/18181b/d4af37?text=Preview';
                  }}
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-medium text-neutral-200 truncate">{value}</p>
                <p className="text-[11px] text-neutral-500 mt-1">Click or drag new image to replace</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Selected
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                      setCustomUrl('');
                    }}
                    className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-400">
              <div className="p-2 rounded-full bg-neutral-800/80 text-[#d4af37] mb-1">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs text-neutral-300 font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-neutral-500">
                PNG, JPG, WEBP • {recommendedSize}
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-400 mt-1">{uploadError}</p>
      )}
    </div>
  );
}
