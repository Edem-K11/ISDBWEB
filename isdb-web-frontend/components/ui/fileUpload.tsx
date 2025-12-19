

// components/ui/FileUpload.tsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Eye, Download } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
  existingFileUrl?: string;
  label?: string;
  accept?: string;
  maxSize?: number;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  existingFileUrl,
  label = 'Télécharger un fichier',
  accept = '.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  error,
  required = false,
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(existingFileUrl || null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onFileUpload(uploadedFile);
      
      // Créer une preview pour les PDF (première page)
      if (uploadedFile.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(URL.createObjectURL(uploadedFile));
        };
        reader.readAsDataURL(uploadedFile);
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    onFileUpload(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Zone de drop */}
      {!preview && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
            dragActive
              ? 'border-isdb-green-500 bg-isdb-green-50'
              : 'border-gray-300 hover:border-isdb-green-400 hover:bg-gray-50',
            error && 'border-red-300'
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className={cn(
                'h-8 w-8',
                dragActive ? 'text-isdb-green-500' : 'text-gray-400'
              )} />
            </div>
            
            <div>
              <p className="font-medium text-gray-900">
                {isDragActive ? 'Déposez le fichier ici' : 'Glissez-déposez votre fichier PDF'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ou cliquez pour sélectionner (max {formatFileSize(maxSize)})
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Seuls les fichiers PDF sont acceptés
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview du fichier */}
      {preview && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="text-red-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {file?.name || 'Programme de formation'}
                </p>
                {file && (
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {existingFileUrl && (
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Voir le fichier"
                >
                  <Eye size={18} />
                </a>
              )}
              
              {preview && !existingFileUrl && (
                <a
                  href={preview}
                  download={file?.name}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download size={18} />
                </a>
              )}
              
              <button
                type="button"
                onClick={removeFile}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Preview PDF (iframe) */}
          {preview && preview.startsWith('blob:') && (
            <div className="border-t border-gray-200">
              <iframe
                src={preview}
                className="w-full h-64"
                title="Preview PDF"
              />
            </div>
          )}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Instructions */}
      <div className="mt-3 text-sm text-gray-500">
        <p>✅ Le fichier doit être au format PDF</p>
        <p>✅ Taille maximale : {formatFileSize(maxSize)}</p>
        <p>✅ Le nom doit être clair (ex: programme-formation-informatique.pdf)</p>
      </div>
    </div>
  );
}