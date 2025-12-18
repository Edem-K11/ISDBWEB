
// hooks/useImageUpload.ts
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Remplacez par votre endpoint d'upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const data = await response.json();
      toast.success('Image téléchargée avec succès');
      return data.url; // L'URL de l'image téléchargée
    } catch (error) {
      toast.error('Erreur lors du téléchargement de l\'image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};