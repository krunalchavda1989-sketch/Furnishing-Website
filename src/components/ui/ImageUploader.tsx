import React, { useState, useRef } from 'react';
import { Upload, Trash2, Link as LinkIcon, Sparkles, Check } from 'lucide-react';
import { useToast } from './ToastNotification';

interface ImageUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  helpText?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide';
  presetSuggestions?: { label: string; url: string }[];
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  helpText = 'Supports PNG, JPG, WEBP, or AVIF (Max 8MB)',
  aspectRatio = 'video',
  presetSuggestions,
  required = false
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File Type', 'Please upload a valid image file (JPEG, PNG, WEBP, etc.)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('File Too Large', 'Please select an image smaller than 8MB for optimal performance.', 'error');
      return;
    }

    const readableSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFileName(file.name);
    setFileSize(readableSize);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        showToast('Image Loaded', `"${file.name}" ready for catalog upload.`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setFileName('');
      setFileSize('');
      showToast('Image URL Applied', 'External web image linked successfully.', 'info');
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setFileSize('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'h-48 sm:h-56 aspect-square';
      case 'portrait':
        return 'h-64 sm:h-72 aspect-[3/4]';
      case 'wide':
        return 'h-36 sm:h-44 aspect-[21/9]';
      case 'video':
      default:
        return 'h-44 sm:h-52 aspect-[16/9]';
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase font-bold tracking-wider text-[#C9A56A] flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-amber-400">*</span>}
        </label>

        <div className="flex items-center bg-[#0F1714] p-0.5 rounded-lg border border-white/10 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-sm'
                : 'text-[#8C9A90] hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeMode === 'url'
                ? 'bg-[#C9A56A] text-[#0F1714] font-bold shadow-sm'
                : 'text-[#8C9A90] hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Web URL</span>
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        className="hidden"
      />

      {/* Preview Container if value exists */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#C9A56A]/40 bg-[#0F1714] group shadow-xl">
          <div className={`w-full ${getAspectClass()} overflow-hidden flex items-center justify-center bg-black/40`}>
            <img
              src={value}
              alt="Uploaded visual asset"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => {
                showToast('Image Load Warning', 'Failed to render image preview. Please check file format or URL.', 'error');
              }}
            />
          </div>

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3.5 opacity-95 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-[#0F1714]/80 text-[#C9A56A] text-[10px] font-mono font-bold border border-[#C9A56A]/30 backdrop-blur-md flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{fileSize || 'Image Active'}</span>
              </span>

              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 transition-all cursor-pointer shadow-lg"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-white/90 font-mono truncate max-w-[200px]" title={fileName || value}>
                {fileName || (value.startsWith('data:') ? 'Uploaded Image File' : value)}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (activeMode === 'upload') {
                    fileInputRef.current?.click();
                  } else {
                    handleRemove();
                  }
                }}
                className="px-3 py-1 rounded-lg bg-[#C9A56A] hover:bg-[#E6C894] text-[#0F1714] text-[10px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Change Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload / URL Zone */
        <div className="space-y-3">
          {activeMode === 'upload' ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                isDragging
                  ? 'border-[#C9A56A] bg-[#C9A56A]/10 scale-[0.99]'
                  : 'border-white/20 bg-[#0F1714]/60 hover:border-[#C9A56A]/60 hover:bg-[#0F1714]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C9A56A]/15 border border-[#C9A56A]/30 flex items-center justify-center text-[#C9A56A] shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-serif font-bold text-white block">
                  Click to Browse or Drag & Drop Image Here
                </span>
                <p className="text-[11px] text-[#8C9A90] font-light">{helpText}</p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-[#163129] border border-[#C9A56A]/30 text-[#C9A56A] text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A56A] hover:text-[#0F1714] transition-all">
                Choose Local Image
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#0F1714]/60 border border-white/15 space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="w-full p-2.5 rounded-xl bg-[#163129] border border-white/15 text-xs text-white focus:border-[#C9A56A] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="px-4 py-2.5 rounded-xl bg-[#C9A56A] text-[#0F1714] text-xs font-bold uppercase tracking-wider hover:bg-[#E6C894] transition-all shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-[#8C9A90]">
                Paste a link to any high-resolution image hosted on Unsplash, Cloudinary, or CDN.
              </p>
            </div>
          )}

          {/* Preset Suggestions */}
          {presetSuggestions && presetSuggestions.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-[#8C9A90] block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C9A56A]" />
                <span>Curated Atelier Presets</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {presetSuggestions.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setFileName(preset.label);
                      setFileSize('Preset');
                      showToast('Preset Selected', `Applied preset: "${preset.label}"`, 'info');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C9A56A]/20 hover:border-[#C9A56A] border border-white/10 text-[10px] text-[#E9DFD1] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A56A]"></span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
