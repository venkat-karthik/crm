/**
 * Cloudinary Media & Image Service
 * Production CDN delivery, transformations, and asset management for Kairoo CRM
 */

import heroWorkspaceImg from '../assets/images/hero_workspace_office_1790601348067.jpg';
import connectedOfficeImg from '../assets/images/connected_office_lifestyle_1790601362384.jpg';
import resultsEnvImg from '../assets/images/results_business_environment_1790601375598.jpg';
import ctaCityImg from '../assets/images/cta_cinematic_city_1790601393970.jpg';

export interface CloudinaryAsset {
  id: string;
  publicId: string;
  name: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
  category: 'crm_showcase' | 'avatar' | 'customer_doc' | 'ticket_attachment' | 'general';
  uploadedAt: string;
}

// Pre-seeded CRM workspace images mapped to reliable bundled assets
export const SEED_CRM_IMAGES: CloudinaryAsset[] = [
  {
    id: 'cld_hero_workspace',
    publicId: 'kairoo_crm/hero_workspace_office',
    name: 'Executive Workspace Display',
    url: heroWorkspaceImg,
    secureUrl: heroWorkspaceImg,
    format: 'jpg',
    width: 1920,
    height: 1080,
    category: 'crm_showcase',
    uploadedAt: '2026-10-04T07:00:00.000Z',
  },
  {
    id: 'cld_office_lifestyle',
    publicId: 'kairoo_crm/connected_office_lifestyle',
    name: 'Connected Team Operations',
    url: connectedOfficeImg,
    secureUrl: connectedOfficeImg,
    format: 'jpg',
    width: 1600,
    height: 900,
    category: 'crm_showcase',
    uploadedAt: '2026-10-04T07:00:00.000Z',
  },
  {
    id: 'cld_results_env',
    publicId: 'kairoo_crm/results_business_environment',
    name: 'Enterprise Client Architecture',
    url: resultsEnvImg,
    secureUrl: resultsEnvImg,
    format: 'jpg',
    width: 1600,
    height: 900,
    category: 'crm_showcase',
    uploadedAt: '2026-10-04T07:00:00.000Z',
  },
  {
    id: 'cld_cta_city',
    publicId: 'kairoo_crm/cta_cinematic_city',
    name: 'Atmospheric Dusk Panorama',
    url: ctaCityImg,
    secureUrl: ctaCityImg,
    format: 'jpg',
    width: 1920,
    height: 1080,
    category: 'crm_showcase',
    uploadedAt: '2026-10-04T07:00:00.000Z',
  },
];

const STORAGE_KEY = 'kairoo_cloudinary_assets';

export const cloudinaryService = {
  /**
   * Get all stored Cloudinary assets
   */
  getAssets(): CloudinaryAsset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CRM_IMAGES));
        return SEED_CRM_IMAGES;
      }
      const parsed: CloudinaryAsset[] = JSON.parse(raw);
      // Auto-heal stale paths for pre-seeded showcase assets
      const seedMap = new Map(SEED_CRM_IMAGES.map((s) => [s.id, s]));
      const updated = parsed.map((a: CloudinaryAsset) => {
        const seed = seedMap.get(a.id);
        if (seed && (!a.secureUrl || a.secureUrl.startsWith('/assets/images/'))) {
          return { ...a, url: seed.url, secureUrl: seed.secureUrl };
        }
        return a;
      });
      // Merge any missing seed images
      const ids = new Set(updated.map((a: CloudinaryAsset) => a.id));
      for (const s of SEED_CRM_IMAGES) {
        if (!ids.has(s.id)) {
          updated.unshift(s);
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return SEED_CRM_IMAGES;
    }
  },

  /**
   * Save a newly uploaded asset
   */
  saveAsset(asset: CloudinaryAsset): CloudinaryAsset {
    const list = this.getAssets();
    const idx = list.findIndex((a) => a.id === asset.id || a.publicId === asset.publicId);
    if (idx !== -1) {
      list[idx] = asset;
    } else {
      list.unshift(asset);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return asset;
  },

  /**
   * Delete asset
   */
  deleteAsset(id: string) {
    const list = this.getAssets().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  /**
   * Generate an optimized Cloudinary delivery URL with dynamic transformation options
   */
  getOptimizedUrl(
    urlOrPublicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'scale' | 'thumb';
      quality?: 'auto' | 'best' | number;
      format?: 'auto' | 'webp' | 'png' | 'jpg';
    }
  ): string {
    if (!urlOrPublicId) return '';
    // If it's a relative asset URL, return as-is
    if (urlOrPublicId.startsWith('/src/') || urlOrPublicId.startsWith('data:')) {
      return urlOrPublicId;
    }

    const cloudName = 'kairoo-crm';
    const transforms: string[] = [];

    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    if (options?.crop) transforms.push(`c_${options.crop}`);
    transforms.push(`q_${options?.quality || 'auto'}`);
    transforms.push(`f_${options?.format || 'auto'}`);

    const transformStr = transforms.join(',');

    if (urlOrPublicId.includes('res.cloudinary.com')) {
      return urlOrPublicId.replace('/upload/', `/upload/${transformStr}/`);
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${urlOrPublicId}`;
  },

  /**
   * Upload an image to Cloudinary via server-side proxy
   */
  async uploadImage(
    fileOrBase64: File | string,
    options: {
      name?: string;
      category?: CloudinaryAsset['category'];
      folder?: string;
    } = {}
  ): Promise<CloudinaryAsset> {
    let dataUrl: string;

    if (fileOrBase64 instanceof File) {
      dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    } else {
      dataUrl = fileOrBase64;
    }

    const payloadName = options.name || (fileOrBase64 instanceof File ? fileOrBase64.name : `asset_${Date.now()}`);

    const env = (import.meta as any).env || {};
    const viteCloudName = env.VITE_CLOUDINARY_CLOUD_NAME;
    const viteUploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // 1. Direct client-side Cloudinary upload (best for static Vercel deployments)
    if (viteCloudName && viteUploadPreset) {
      try {
        const formData = new FormData();
        if (fileOrBase64 instanceof File) {
          formData.append('file', fileOrBase64);
        } else {
          formData.append('file', dataUrl);
        }
        formData.append('upload_preset', viteUploadPreset);
        if (options.folder) formData.append('folder', options.folder);

        const directRes = await fetch(`https://api.cloudinary.com/v1_1/${viteCloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (directRes.ok) {
          const resData = await directRes.json();
          const asset: CloudinaryAsset = {
            id: resData.asset_id || `cld_${Date.now()}`,
            publicId: resData.public_id || `kairoo_crm/${Date.now()}`,
            name: payloadName,
            url: resData.secure_url || resData.url,
            secureUrl: resData.secure_url || resData.url,
            format: resData.format || 'jpg',
            width: resData.width,
            height: resData.height,
            bytes: resData.bytes,
            category: options.category || 'general',
            uploadedAt: resData.created_at || new Date().toISOString(),
          };
          this.saveAsset(asset);
          return asset;
        }
      } catch (directErr) {
        console.warn('Direct Cloudinary client upload failed, checking server-side proxy:', directErr);
      }
    }

    // 2. Server-side proxy upload (for environments with Express server.ts running)
    try {
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          folder: options.folder || 'kairoo_crm',
          name: payloadName,
          category: options.category || 'general',
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        const asset: CloudinaryAsset = {
          id: resData.id || `cld_${Date.now()}`,
          publicId: resData.public_id || `kairoo_crm/${Date.now()}`,
          name: payloadName,
          url: resData.secure_url || resData.url || dataUrl,
          secureUrl: resData.secure_url || resData.url || dataUrl,
          format: resData.format || 'jpg',
          width: resData.width,
          height: resData.height,
          bytes: resData.bytes,
          category: options.category || 'general',
          uploadedAt: new Date().toISOString(),
        };
        this.saveAsset(asset);
        return asset;
      }
    } catch (err) {
      console.warn('Server Cloudinary proxy upload failed, falling back to local persistent asset:', err);
    }

    // High reliability client fallback
    const fallbackAsset: CloudinaryAsset = {
      id: `cld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      publicId: `kairoo_crm/${Date.now()}`,
      name: payloadName,
      url: dataUrl,
      secureUrl: dataUrl,
      format: dataUrl.split(';')[0].split('/')[1] || 'png',
      category: options.category || 'general',
      uploadedAt: new Date().toISOString(),
    };
    this.saveAsset(fallbackAsset);
    return fallbackAsset;
  },

  /**
   * Sync and upload existing CRM showcase photos into Cloudinary
   */
  async syncLocalPhotosToCloudinary(): Promise<CloudinaryAsset[]> {
    try {
      const response = await fetch('/api/cloudinary/sync-crm-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.assets && Array.isArray(data.assets)) {
          for (const item of data.assets) {
            this.saveAsset({
              id: item.id || `cld_${item.public_id}`,
              publicId: item.public_id,
              name: item.name,
              url: item.secure_url || item.url,
              secureUrl: item.secure_url || item.url,
              format: item.format || 'jpg',
              width: item.width || 1920,
              height: item.height || 1080,
              category: 'crm_showcase',
              uploadedAt: item.uploadedAt || new Date().toISOString(),
            });
          }
          return this.getAssets();
        }
      }
    } catch (err) {
      console.warn('API sync photos failed, utilizing client fallback:', err);
    }

    // Client fallback: make sure all SEED_CRM_IMAGES are saved in assets
    for (const seed of SEED_CRM_IMAGES) {
      this.saveAsset(seed);
    }
    return this.getAssets();
  },
};
