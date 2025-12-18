
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { imageService, ImageType } from '@/lib/api/services/imageService';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  type?: ImageType; 
}


export default function ImageUpload({ 
  value, 
  onChange, 
  label,
  type = 'blogs' // ← Par défaut 'blogs'
}: ImageUploadProps) {
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (value) {
      setPreview(imageService.getUrl(value));
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload avec le bon type
        const { url } = await imageService.upload(file, type); // ← Passer le type
        
        onChange(url);
        setPreview(imageService.getUrl(url));
        
        toast.success('Image uploadée avec succès !');
      } catch (error: any) {
        console.error('Erreur upload:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
        setPreview('');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, type] // ← Ajouter type dans les dépendances
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5242880,
    disabled: isUploading,
  });

  const removeImage = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
          />
          {!isUploading && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-2" />
                <p className="text-white font-medium">Upload en cours...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : isUploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <>
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <p className="text-gray-600 font-medium">Upload en cours...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  {isDragActive ? (
                    <Upload className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    {isDragActive
                      ? 'Déposez votre image ici'
                      : 'Glissez-déposez une image'}
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour parcourir (max 5MB)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, JPEG, GIF, WEBP
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
