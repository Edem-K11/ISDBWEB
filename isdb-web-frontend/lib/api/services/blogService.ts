

import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { Blog, BlogFormData, BlogFilters} from '@/lib/types/blog';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export const blogService = {
  // Récupérer tous les blogs publiés
  getAll: async (params?: {
    page?: number;
    tag?: string;
    search?: string;
  }) => {
    const { data } = await apiClient.get<PaginatedResponse<Blog>>(
      ENDPOINTS.BLOGS,
      { params }
    );
    return data;
  },

  // Récupérer un blog par slug
  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Blog>>(
      ENDPOINTS.BLOG_BY_SLUG(slug)
    );
    return data.data;
  },

   // Récupérer un blog par ID (admin)
  getById: async (id: number) => {
    const { data } = await apiClient.get(ENDPOINTS.ADMIN_BLOG_BY_ID(id));
    return data.data;
  },


  // Admin: Récupérer tous les blogs
  getAllAdmin: async (params?: BlogFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<Blog>>(
      ENDPOINTS.DASHBOARD_BLOGS,
      { params}
    );
    return data;
  },

  // Admin: Créer un blog
  create: async (blogData: BlogFormData) => {
    const { data } = await apiClient.post<ApiResponse<Blog>>(
      ENDPOINTS.DASHBOARD_BLOGS,
      blogData
    );
    return data;
  },

  // Admin: Mettre à jour un blog
  update: async (id: number, blogData: Partial<BlogFormData>) => {
    const { data } = await apiClient.put<ApiResponse<Blog>>(
      ENDPOINTS.ADMIN_BLOG_BY_ID(id),
      blogData
    );
    return data;
  },

  // Admin: Supprimer un blog
  delete: async (id: number) => {
    const { data } = await apiClient.delete(ENDPOINTS.ADMIN_BLOG_BY_ID(id));
    return data;
  },

  // Admin: Changer le statut
  updateStatut: async (id: number, statut: 'brouillon' | 'publie') => {
    const { data } = await apiClient.patch<ApiResponse<Blog>>(
      ENDPOINTS.ADMIN_BLOG_STATUT(id),
      { statut }
    );
    return data;
  },

};