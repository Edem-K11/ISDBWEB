'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { imageService, ImageType } from '@/lib/api/services/imageService';
import toast from 'react-hot-toast';

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  type?: ImageType;
  /** Vignettes plus petites et plus nombreuses par ligne (ex: galerie générale dans le dashboard). */
  compact?: boolean;
}

export default function GalleryUpload({
  value,
  onChange,
  label,
  type = 'blogs',
  compact = false,
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      try {
        const uploaded = await imageService.uploadMultiple(acceptedFiles, type);
        onChange([...value, ...uploaded.map((img) => img.url)]);
        toast.success(`${uploaded.length} image(s) ajoutée(s)`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Erreur lors de l'upload");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, type, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: true,
    maxSize: 5242880,
    disabled: isUploading,
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}

      <div
        className={
          compact
            ? 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'
            : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
        }
      >
        {value.map((url, index) => (
          <div
            key={url}
            className={`group relative aspect-square overflow-hidden border-gray-200 ${
              compact ? 'rounded-lg border' : 'rounded-xl border-2'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageService.getUrl(url)}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className={`absolute top-1 right-1 rounded-full bg-red-600 text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100 ${
                compact ? 'p-1' : 'p-1.5'
              }`}
            >
              <X className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
            </button>
          </div>
        ))}

        <div
          {...getRootProps()}
          className={`flex aspect-square flex-col items-center justify-center border-dashed transition-all ${
            compact ? 'rounded-lg border' : 'rounded-xl border-2'
          } ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50 cursor-pointer'
              : isUploading
              ? 'cursor-not-allowed border-gray-300 bg-gray-50'
              : 'cursor-pointer border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className={compact ? 'h-4 w-4 animate-spin text-indigo-600' : 'h-6 w-6 animate-spin text-indigo-600'} />
          ) : (
            <>
              <ImagePlus className={compact ? 'h-4 w-4 text-indigo-600' : 'mb-1 h-6 w-6 text-indigo-600'} />
              {!compact && <span className="px-2 text-center text-xs text-gray-500">Ajouter</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
