import { isSupabaseConfigured, supabase } from './client';

export const BUCKET_NAME = 'aurumm-media';

export interface UploadResult {
  url: string;
  error?: string;
}

/**
 * Uploads a file to the Supabase 'aurumm-media' storage bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadMediaAsset(
  file: File,
  folder: string = 'content'
): Promise<UploadResult> {
  if (!file) {
    return { url: '', error: 'No file provided' };
  }

  // Fallback for local testing before Supabase env vars are supplied
  if (!isSupabaseConfigured()) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
        });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Failed to read file locally' });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const fileName = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { url: '', error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      url: publicUrlData.publicUrl,
    };
  } catch (err: any) {
    console.error('Upload exception:', err);
    return { url: '', error: err.message || 'Failed to upload asset' };
  }
}
