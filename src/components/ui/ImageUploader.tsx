'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Upload,
  X,
  Check,
  Link as LinkIcon,
  Loader2,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { uploadMediaAsset } from '@/lib/supabase/storage';
import {
  getImageDimensionsFromFile,
  getImageDimensionsFromUrl,
  validateImageDimensions,
  getFriendlyRatioLabel,
  ImageDimensionRules,
  DetectedImageInfo,
} from '@/lib/image-validation';

export interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: string; // e.g. '1:1', '4:5', '16:9', '4:3', '15:4'
  aspectRatioTolerance?: number; // e.g. 0.08
  recommendedSize?: string; // e.g. '1024 × 1024px (1:1)'
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  maxSizeMB?: number; // e.g. 5, 10
  strictValidation?: boolean; // default true: rejects upload if dimension validation fails
  helperText?: string;
}

export function ImageUploader({
  label = 'Image',
  value,
  onChange,
  folder = 'content',
  aspectRatio,
  aspectRatioTolerance = 0.08,
  recommendedSize = 'e.g. 1200x800px',
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  exactWidth,
  exactHeight,
  maxSizeMB = 10,
  strictValidation = true,
  helperText,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDimensionErrors, setUploadDimensionErrors] = useState<string[]>([]);
  const [existingDimensionErrors, setExistingDimensionErrors] = useState<string[]>([]);
  const [detectedDimensions, setDetectedDimensions] = useState<DetectedImageInfo | null>(null);
  const [isDimensionValid, setIsDimensionValid] = useState<boolean | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const friendlyRatio = useMemo(() => getFriendlyRatioLabel(aspectRatio), [aspectRatio]);

  const dimensionRules: ImageDimensionRules = useMemo(
    () => ({
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      exactWidth,
      exactHeight,
      aspectRatio,
      aspectRatioTolerance,
      maxSizeMB,
      label,
    }),
    [
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      exactWidth,
      exactHeight,
      aspectRatio,
      aspectRatioTolerance,
      maxSizeMB,
      label,
    ]
  );

  const hasRules = Boolean(
    minWidth ||
    minHeight ||
    maxWidth ||
    maxHeight ||
    exactWidth ||
    exactHeight ||
    aspectRatio ||
    maxSizeMB
  );

  // Validate existing image URL whenever value changes
  useEffect(() => {
    if (!value) {
      return;
    }

    let isMounted = true;
    getImageDimensionsFromUrl(value)
      .then(({ width, height }) => {
        if (!isMounted) return;
        const result = validateImageDimensions(width, height, dimensionRules);
        setDetectedDimensions(result.dimensions);
        setIsDimensionValid(result.isValid);
        setExistingDimensionErrors(result.isValid ? [] : result.errors);
      })
      .catch(() => {
        if (!isMounted) return;
        // Image URL could not be loaded via Image() object
        setDetectedDimensions(null);
        setIsDimensionValid(null);
        setExistingDimensionErrors([]);
      });

    return () => {
      isMounted = false;
    };
  }, [value, dimensionRules]);

  const executeUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    const res = await uploadMediaAsset(file, folder);
    setIsUploading(false);

    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      onChange(res.url);
      setCustomUrl(res.url);
      setUploadDimensionErrors([]);
      setPendingFile(null);
    }
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    setUploadError(null);
    setUploadDimensionErrors([]);
    setPendingFile(file);

    // Run dimension validation before upload
    setIsValidating(true);
    try {
      const { width, height } = await getImageDimensionsFromFile(file);
      const validation = validateImageDimensions(width, height, dimensionRules, file.size);

      setDetectedDimensions(validation.dimensions);
      setIsDimensionValid(validation.isValid);
      setIsValidating(false);

      if (!validation.isValid) {
        setUploadDimensionErrors(validation.errors);
        setUploadError('Image dimension validation failed. Please review the requirements below.');

        // If strict validation is disabled, automatically proceed with upload
        if (!strictValidation) {
          await executeUpload(file);
        }
        return;
      }

      // Valid - proceed to upload
      await executeUpload(file);
    } catch (err: unknown) {
      setIsValidating(false);
      console.warn('Could not inspect image dimensions prior to upload:', err);
      // Fallback: proceed to upload if inspection encounters an unhandled format error
      await executeUpload(file);
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

  const handleDismissError = () => {
    setUploadError(null);
    setUploadDimensionErrors([]);
    setPendingFile(null);
  };

  const handleBypassAndUpload = () => {
    if (pendingFile) {
      executeUpload(pendingFile);
    }
  };

  const activeDimensions = value ? detectedDimensions : null;
  const activeDimensionValid = value ? isDimensionValid : null;

  return (
    <div className="space-y-2.5">
      {/* Header bar with Label, Prominent Accepted Ratio & Dimensions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs font-medium uppercase tracking-wider text-[#d4af37]">
            {label}
          </label>

          {/* Prominent Accepted Aspect Ratio Badge */}
          {aspectRatio && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/35 flex items-center gap-1.5 font-medium tracking-tight shadow-sm"
              title={`Accepted aspect ratio for this field is ${friendlyRatio}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              Ratio: <strong className="text-white font-semibold">{friendlyRatio}</strong>
            </span>
          )}

          {/* Min Dimension requirement */}
          {(minWidth || minHeight) && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800/90 text-neutral-300 border border-neutral-700/80 font-mono">
              Min: {minWidth || 0}×{minHeight || 0}px
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowUrlInput((prev) => !prev);
            setCustomUrl(value || '');
          }}
          className="text-xs text-neutral-400 hover:text-[#d4af37] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Upload file instead' : 'Enter URL / Local path'}
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-neutral-400 -mt-1">{helperText}</p>
      )}

      {showUrlInput ? (
        <div className="space-y-2">
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
                  setDetectedDimensions(null);
                  setIsDimensionValid(null);
                  setExistingDimensionErrors([]);
                }}
                className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-3.5 sm:p-4 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[135px] text-center ${
            isDragging
              ? 'border-[#d4af37] bg-[#d4af37]/10'
              : uploadDimensionErrors.length > 0 && !value
              ? 'border-red-500/50 bg-red-950/10'
              : 'border-neutral-800 hover:border-[#d4af37]/50 bg-neutral-900/50 hover:bg-neutral-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileChange(e.target.files[0]);
                e.target.value = '';
              }
            }}
          />

          {isValidating ? (
            <div className="flex flex-col items-center gap-2 text-neutral-400 py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
              <span className="text-xs text-neutral-300">Validating image dimensions...</span>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center gap-2 text-neutral-400 py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
              <span className="text-xs text-neutral-300">Uploading image to storage...</span>
            </div>
          ) : value ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 w-full">
              <div className="relative w-32 sm:w-44 h-24 sm:h-28 rounded-xl overflow-hidden bg-[#070709] border border-neutral-800 shrink-0 flex items-center justify-center p-2 shadow-inner">
                {/* Subtle pattern for transparent PNG logos */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: '8px 8px',
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={label}
                  className={`relative z-10 w-full h-full ${
                    fitMode === 'contain' ? 'object-contain' : 'object-cover'
                  } transition-all`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/200x200/18181b/d4af37?text=Preview';
                  }}
                />
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0 w-full space-y-1.5">
                <p className="text-xs font-medium text-neutral-200 truncate" title={value}>
                  {value}
                </p>

                {/* Dimension & Status Badges */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1 border border-emerald-500/30">
                    <Check className="w-2.5 h-2.5" /> Selected
                  </span>

                  {activeDimensions && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1 border ${
                        activeDimensionValid === true
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : activeDimensionValid === false
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}
                      title={`Dimensions: ${activeDimensions.width}×${activeDimensions.height}px (${activeDimensions.aspectRatioFormatted})`}
                    >
                      <Maximize2 className="w-2.5 h-2.5" />
                      {activeDimensions.width > 0 && activeDimensions.height > 0
                        ? `${activeDimensions.width} × ${activeDimensions.height}px`
                        : 'Vector SVG'}
                      {` (${activeDimensions.aspectRatioFormatted})`}
                      {activeDimensionValid === true && ' ✓'}
                      {activeDimensionValid === false && ' ⚠️'}
                    </span>
                  )}

                  {aspectRatio && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/10 text-[#f5d77f] font-medium border border-[#d4af37]/25">
                      Required: {friendlyRatio}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-500">
                  Click or drag new image to replace
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFitMode(fitMode === 'contain' ? 'cover' : 'contain');
                    }}
                    className="text-[11px] text-neutral-400 hover:text-[#d4af37] flex items-center gap-1 cursor-pointer transition-colors"
                    title="Toggle between Full view (contain) and Cropped view (cover)"
                  >
                    <span>Fit: {fitMode === 'contain' ? 'Full' : 'Crop'}</span>
                  </button>
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-neutral-400 hover:text-[#d4af37] flex items-center gap-1 cursor-pointer transition-colors"
                    title="Open full resolution in new tab"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange('');
                      setCustomUrl('');
                      setDetectedDimensions(null);
                      setIsDimensionValid(null);
                      setExistingDimensionErrors([]);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-neutral-400 py-1">
              <div className="p-2.5 rounded-full bg-neutral-800/80 text-[#d4af37] mb-0.5">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs text-neutral-200 font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-neutral-400">
                PNG, JPG, WEBP, SVG • {recommendedSize}
              </p>

              {/* Requirement Badges */}
              {hasRules && (
                <div className="flex items-center justify-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-neutral-800/80 w-full max-w-md">
                  {aspectRatio && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/35 font-medium">
                      Accepted Ratio: <strong>{friendlyRatio}</strong>
                    </span>
                  )}
                  {(minWidth || minHeight) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                      Min: {minWidth || 0}×{minHeight || 0}px
                    </span>
                  )}
                  {(maxWidth || maxHeight) && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                      Max: {maxWidth || '∞'}×{maxHeight || '∞'}px
                    </span>
                  )}
                  {maxSizeMB && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                      Max: {maxSizeMB}MB
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Existing image dimension mismatch warning */}
      {value && activeDimensionValid === false && existingDimensionErrors.length > 0 && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Image Dimension Notice</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-amber-200/90 pl-1 space-y-0.5">
            {existingDimensionErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Dimension Validation Error Card */}
      {uploadDimensionErrors.length > 0 && !value && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-red-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Dimension Validation Failed</span>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {detectedDimensions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                  Your Uploaded File:
                </span>
                <p className="text-white font-semibold">
                  {detectedDimensions.width} × {detectedDimensions.height}px
                </p>
                <p className="text-amber-400 text-[10px]">
                  Detected Ratio: <strong>{detectedDimensions.aspectRatioFormatted}</strong>
                </p>
                {detectedDimensions.fileSizeFormatted && (
                  <p className="text-neutral-400 text-[10px]">
                    Size: {detectedDimensions.fileSizeFormatted}
                  </p>
                )}
              </div>

              <div className="space-y-0.5 sm:border-l sm:border-neutral-800 sm:pl-2.5">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-medium block">
                  Accepted Specifications:
                </span>
                {aspectRatio ? (
                  <p className="text-[#f5d77f] font-semibold">
                    Ratio: <strong>{friendlyRatio}</strong>
                  </p>
                ) : (
                  <p className="text-white font-medium">Any aspect ratio</p>
                )}
                {(minWidth || minHeight) && (
                  <p className="text-neutral-300 text-[10px]">
                    Min Dimensions: {minWidth || 0} × {minHeight || 0}px
                  </p>
                )}
                {maxSizeMB && (
                  <p className="text-neutral-400 text-[10px]">
                    Max Size: {maxSizeMB}MB
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-[11px] text-red-300 font-medium">The selected image cannot be uploaded due to:</p>
            <ul className="list-disc list-inside text-[11px] text-red-300/90 pl-1 space-y-0.5">
              {uploadDimensionErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-red-500/20">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Select Different File
            </button>

            {!strictValidation && pendingFile && (
              <button
                type="button"
                onClick={handleBypassAndUpload}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Upload Anyway
              </button>
            )}
          </div>
        </div>
      )}

      {/* Generic Upload Error */}
      {uploadError && uploadDimensionErrors.length === 0 && (
        <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
