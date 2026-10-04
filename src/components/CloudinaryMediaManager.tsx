import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Copy,
  Trash2,
  ExternalLink,
  Sparkles,
  Cloud,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { cloudinaryService, CloudinaryAsset } from '../services/cloudinary';

interface CloudinaryMediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  title?: string;
  category?: CloudinaryAsset['category'];
}

export const CloudinaryMediaManager: React.FC<CloudinaryMediaManagerProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Cloudinary CDN Asset Manager',
  category = 'general',
}) => {
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | CloudinaryAsset['category']>('all');
  const [dragOver, setDragOver] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<CloudinaryAsset | null>(null);

  const [syncingPhotos, setSyncingPhotos] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const loadAssets = () => {
    setAssets(cloudinaryService.getAssets());
  };

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen]);

  const handleSyncCrmPhotos = async () => {
    setSyncingPhotos(true);
    setSyncToast(null);
    try {
      const updated = await cloudinaryService.syncLocalPhotosToCloudinary();
      setAssets(updated);
      setSyncToast('All 4 CRM showcase photos successfully uploaded and synchronized with Cloudinary!');
      setTimeout(() => setSyncToast(null), 4500);
    } catch (err) {
      console.error('Failed to sync CRM photos to Cloudinary:', err);
    } finally {
      setSyncingPhotos(false);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setUploading(true);
    try {
      const asset = await cloudinaryService.uploadImage(file, {
        name: file.name.replace(/\.[^/.]+$/, ''),
        category,
        folder: 'kairoo_crm',
      });
      loadAssets();
      if (onSelectImage) {
        onSelectImage(asset.secureUrl);
      }
    } catch (err) {
      console.error('Failed to upload image to Cloudinary:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this asset from your media gallery?')) {
      cloudinaryService.deleteAsset(id);
      loadAssets();
      if (previewAsset?.id === id) setPreviewAsset(null);
    }
  };

  const filteredAssets = assets.filter((a) => {
    if (selectedFilter === 'all') return true;
    return a.category === selectedFilter;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#0D2218]/15 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-[#0D2218] text-[#FAF6F0] p-5 sm:p-6 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#FAF6F0]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#3448C5] text-white">
                <Cloud className="w-3.5 h-3.5 fill-current" />
                Cloudinary CDN Integrated
              </span>
              <span className="text-xs text-[#FAF6F0]/70 font-mono">
                Auto WebP · Global CDN Delivery
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-[#FAF6F0]/80 mt-1 max-w-xl">
              Upload, optimize, and manage CRM assets, customer documents, team avatars, and showcase photos with Cloudinary.
            </p>
          </div>

          {/* Sync notification toast */}
          {syncToast && (
            <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 px-6 shrink-0">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncToast}</span>
            </div>
          )}

          {/* Sub Navigation Bar & Category Filter */}
          <div className="p-3 sm:p-4 bg-[#FAF6F0] border-b border-[#0D2218]/10 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold max-w-full pb-1 sm:pb-0">
              {[
                { id: 'all', label: `All Media (${assets.length})` },
                { id: 'crm_showcase', label: 'CRM Showcase Photos' },
                { id: 'avatar', label: 'User Avatars' },
                { id: 'customer_doc', label: 'Customer Documents' },
                { id: 'ticket_attachment', label: 'Ticket Attachments' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                    selectedFilter === f.id
                      ? 'bg-[#0D2218] text-white shadow-xs'
                      : 'bg-white text-[#5C6862] hover:text-[#0D2218] border border-[#0D2218]/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncCrmPhotos}
                disabled={syncingPhotos}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-white hover:bg-[#0D2218] hover:text-white text-[#0D2218] border border-[#0D2218]/15 text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Sync and upload existing CRM showcase photos into Cloudinary"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPhotos ? 'animate-spin' : ''}`} />
                <span>{syncingPhotos ? 'Syncing...' : 'Sync CRM Photos'}</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#0D2218] hover:bg-[#163827] text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95">
                <UploadCloud className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Dropzone & Gallery Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center ${
                dragOver
                  ? 'border-[#3448C5] bg-[#3448C5]/5'
                  : 'border-[#0D2218]/20 bg-[#FAF6F0] hover:border-[#0D2218]/40'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-[#5C6862] mx-auto mb-2" />
              <div className="text-xs font-extrabold text-[#0D2218]">
                Drag and drop your photos here, or click "Upload Image" above
              </div>
              <p className="text-[11px] text-[#5C6862] mt-1">
                Optimized on-the-fly with Cloudinary: auto-converted to WebP with responsive compression.
              </p>
            </div>

            {/* Gallery Grid */}
            {filteredAssets.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5C6862]">
                No assets in this category yet. Upload your first photo above!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => {
                  const isCopied = copiedId === asset.id;

                  return (
                    <div
                      key={asset.id}
                      className="bg-white rounded-2xl border border-[#0D2218]/12 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-[#FAF6F0] overflow-hidden">
                        <img
                          src={asset.secureUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-[#0D2218]/80 backdrop-blur-xs text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                          {asset.category.replace('_', ' ')}
                        </div>
                      </div>

                      <div className="p-3">
                        <div className="font-extrabold text-xs text-[#0D2218] truncate mb-0.5" title={asset.name}>
                          {asset.name}
                        </div>
                        <div className="text-[10px] text-[#5C6862] truncate font-mono">
                          {asset.publicId}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 pt-2.5 border-t border-[#0D2218]/10 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(asset.secureUrl, asset.id)}
                            className="flex-1 py-1.5 px-2 bg-[#FAF6F0] hover:bg-[#0D2218] hover:text-white text-[#0D2218] text-[11px] font-extrabold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy CDN'}</span>
                          </button>

                          {onSelectImage && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectImage(asset.secureUrl);
                                onClose();
                              }}
                              className="py-1.5 px-2 bg-[#0D2218] hover:bg-[#163827] text-white text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                            >
                              Select
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(asset.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Footnote */}
          <div className="p-4 bg-[#FAF6F0] border-t border-[#0D2218]/10 flex items-center justify-between text-xs text-[#5C6862]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cloudinary CDN Assets Stored & Encrypted</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-[#0D2218]/15 rounded-xl font-bold text-[#0D2218] hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
