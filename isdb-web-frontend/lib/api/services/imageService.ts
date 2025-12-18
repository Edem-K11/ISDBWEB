
import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';


export type ImageType = 'blogs' | 'redacteurs' | 'avatars';

export const imageService = {
  /**
   * Upload une seule image
   */
  upload: async (file: File, type: ImageType = 'blogs'): Promise<{ url: string; path: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const { data } = await apiClient.post(ENDPOINTS.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      url: data.url,
      path: data.path,
    };
  },

  /**
   * Upload plusieurs images
   */
  uploadMultiple: async (files: File[], type: ImageType = 'blogs'): Promise<Array<{ url: string; path: string }>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images[]', file);
    });
    formData.append('type', type);

    const { data } = await apiClient.post(ENDPOINTS.UPLOAD_MULTIPLE_IMAGES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.images;
  },

  /**
   * Supprimer une image
   */
  delete: async (path: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.DELETE_IMAGE, {
      data: { path },
    });
  },

  /**
   * Construire l'URL complète d'une image
   */
  getUrl: (path: string | null | undefined): string => {
    // Si pas de path, retourner image par défaut
    if (!path || path.trim() === '') {
      return '/logo_isdb.png';
    }

    // Si c'est déjà une URL complète (http:// ou https://)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Si c'est un chemin local (commence par /)
    if (path.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
      return `${baseUrl}${path}`;
    }

    // Sinon, ajouter le baseUrl + /storage/
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
  },
};
