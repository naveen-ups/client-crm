/**
 * Image dimension validation utilities for Aurumm CRM.
 * Provides client-side dimension extraction, aspect ratio parsing,
 * and comprehensive rule validation for uploaded images.
 */

export interface ImageDimensionRules {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  aspectRatio?: string | number;
  aspectRatioTolerance?: number; // default 0.08 (8%)
  maxSizeMB?: number;
  allowedFormats?: string[];
}

export interface DetectedImageInfo {
  width: number;
  height: number;
  aspectRatioNum: number;
  aspectRatioFormatted: string;
  fileSizeBytes?: number;
  fileSizeFormatted?: string;
}

export interface ImageValidationResult {
  isValid: boolean;
  dimensions: DetectedImageInfo;
  errors: string[];
  warnings: string[];
}

/**
 * Parses an aspect ratio string like "1:1", "4:5", "16:9", "4/3", or number to a decimal ratio (width / height).
 */
export function parseAspectRatio(aspectRatio?: string | number): number | null {
  if (aspectRatio === undefined || aspectRatio === null) return null;
  if (typeof aspectRatio === 'number') {
    return aspectRatio > 0 ? aspectRatio : null;
  }

  const str = aspectRatio.trim();
  if (!str) return null;

  // Handle delimiter like ':' or '/'
  const separator = str.includes(':') ? ':' : str.includes('/') ? '/' : null;
  if (separator) {
    const parts = str.split(separator);
    if (parts.length === 2) {
      const w = parseFloat(parts[0].trim());
      const h = parseFloat(parts[1].trim());
      if (!isNaN(w) && !isNaN(h) && h > 0 && w > 0) {
        return w / h;
      }
    }
  }

  const num = parseFloat(str);
  return !isNaN(num) && num > 0 ? num : null;
}

/**
 * Returns a human-friendly aspect ratio label for a given ratio decimal.
 */
export function formatAspectRatio(ratio: number): string {
  if (!ratio || isNaN(ratio) || ratio <= 0) return 'Unknown';

  // Common standard ratios with matching tolerance
  const standardRatios: Array<{ ratio: number; label: string; tolerance: number }> = [
    { ratio: 1.0, label: '1:1 (Square)', tolerance: 0.04 },
    { ratio: 0.8, label: '4:5 (Portrait)', tolerance: 0.04 },
    { ratio: 0.75, label: '3:4 (Portrait)', tolerance: 0.04 },
    { ratio: 0.667, label: '2:3 (Portrait)', tolerance: 0.04 },
    { ratio: 0.5625, label: '9:16 (Story)', tolerance: 0.04 },
    { ratio: 1.333, label: '4:3 (Landscape)', tolerance: 0.04 },
    { ratio: 1.5, label: '3:2 (Landscape)', tolerance: 0.04 },
    { ratio: 1.778, label: '16:9 (Widescreen)', tolerance: 0.05 },
    { ratio: 2.333, label: '21:9 (Ultrawide)', tolerance: 0.06 },
    { ratio: 3.75, label: '15:4 (Banner)', tolerance: 0.08 },
  ];

  for (const s of standardRatios) {
    if (Math.abs(ratio - s.ratio) <= s.tolerance) {
      return s.label;
    }
  }

  return ratio >= 1
    ? `${ratio.toFixed(2)}:1`
    : `1:${(1 / ratio).toFixed(2)}`;
}

/**
 * Returns a human-friendly ratio description for an aspect ratio string or number like "1:1", "4:3", etc.
 */
export function getFriendlyRatioLabel(aspectRatio?: string | number): string {
  if (aspectRatio === undefined || aspectRatio === null) return '';
  const num = parseAspectRatio(aspectRatio);
  if (!num) return String(aspectRatio);
  return formatAspectRatio(num);
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Extracts width and height from an image File object.
 */
export function getImageDimensionsFromFile(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Special handling for SVG files
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) || '';
        const viewBoxMatch = content.match(
          /viewBox=["']\s*[\d.-]+\s+[\d.-]+\s+([\d.-]+)\s+([\d.-]+)\s*["']/i
        );
        const widthMatch = content.match(/width=["']([\d.-]+)(?:px)?["']/i);
        const heightMatch = content.match(/height=["']([\d.-]+)(?:px)?["']/i);

        let width = widthMatch ? parseFloat(widthMatch[1]) : 0;
        let height = heightMatch ? parseFloat(heightMatch[1]) : 0;

        if ((!width || !height) && viewBoxMatch) {
          width = parseFloat(viewBoxMatch[1]);
          height = parseFloat(viewBoxMatch[2]);
        }

        if (width > 0 && height > 0) {
          resolve({ width: Math.round(width), height: Math.round(height) });
          return;
        }

        // Fallback for SVGs without explicit dimensions
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.naturalWidth || 0, height: img.naturalHeight || 0 });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve({ width: 0, height: 0 });
        };
        img.src = url;
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsText(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not parse image file to read dimensions'));
    };
    img.src = objectUrl;
  });
}

/**
 * Extracts width and height from an image URL.
 */
export function getImageDimensionsFromUrl(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      reject(new Error('Invalid image URL'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      // Retry without anonymous crossOrigin attribute in case server restricts CORS
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        resolve({ width: fallbackImg.naturalWidth, height: fallbackImg.naturalHeight });
      };
      fallbackImg.onerror = () => {
        reject(new Error('Failed to load image from URL'));
      };
      fallbackImg.src = url;
    };

    img.src = url;
  });
}

/**
 * Validates width, height and file size against given dimension rules.
 */
export function validateImageDimensions(
  width: number,
  height: number,
  rules: ImageDimensionRules,
  fileSizeBytes?: number
): ImageValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const ratio = height > 0 ? width / height : 1;
  const dimensions: DetectedImageInfo = {
    width,
    height,
    aspectRatioNum: ratio,
    aspectRatioFormatted: formatAspectRatio(ratio),
    fileSizeBytes,
    fileSizeFormatted: formatFileSize(fileSizeBytes),
  };

  // If width and height are 0 (e.g. dimensionless scalable SVG vector), allow with caution
  if (width === 0 && height === 0) {
    warnings.push('Vector SVG image has scalable dimensions.');
    return {
      isValid: true,
      dimensions,
      errors: [],
      warnings,
    };
  }

  // 1. File size check
  if (rules.maxSizeMB && fileSizeBytes && fileSizeBytes > 0) {
    const sizeMB = fileSizeBytes / (1024 * 1024);
    if (sizeMB > rules.maxSizeMB) {
      errors.push(
        `File size is ${sizeMB.toFixed(1)} MB, which exceeds the maximum allowed limit of ${rules.maxSizeMB} MB.`
      );
    }
  }

  // 2. Exact dimensions check
  if (rules.exactWidth && width !== rules.exactWidth) {
    errors.push(`Width must be exactly ${rules.exactWidth}px (actual: ${width}px).`);
  }
  if (rules.exactHeight && height !== rules.exactHeight) {
    errors.push(`Height must be exactly ${rules.exactHeight}px (actual: ${height}px).`);
  }

  // 3. Minimum dimensions check
  if (rules.minWidth && width < rules.minWidth) {
    errors.push(
      `Width (${width}px) is less than the required minimum of ${rules.minWidth}px.`
    );
  }
  if (rules.minHeight && height < rules.minHeight) {
    errors.push(
      `Height (${height}px) is less than the required minimum of ${rules.minHeight}px.`
    );
  }

  // 4. Maximum dimensions check
  if (rules.maxWidth && width > rules.maxWidth) {
    errors.push(
      `Width (${width}px) exceeds the maximum allowed of ${rules.maxWidth}px.`
    );
  }
  if (rules.maxHeight && height > rules.maxHeight) {
    errors.push(
      `Height (${height}px) exceeds the maximum allowed of ${rules.maxHeight}px.`
    );
  }

  // 5. Aspect ratio check
  if (rules.aspectRatio) {
    const expectedRatio = parseAspectRatio(rules.aspectRatio);
    if (expectedRatio && height > 0) {
      const tolerance = rules.aspectRatioTolerance ?? 0.08;
      const diff = Math.abs(ratio - expectedRatio) / expectedRatio;

      if (diff > tolerance) {
        errors.push(
          `Aspect ratio is ${dimensions.aspectRatioFormatted} (${width}×${height}px). Required: ${rules.aspectRatio} (±${Math.round(tolerance * 100)}%).`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    dimensions,
    errors,
    warnings,
  };
}
