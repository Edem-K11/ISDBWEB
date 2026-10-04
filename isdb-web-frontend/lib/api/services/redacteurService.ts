

import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { Redacteur } from '@/lib/types/redacteur';
import { ApiResponse } from '@/lib/types/api';

export const redacteurService = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Redacteur[]>>(ENDPOINTS.REDACTEURS);
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Redacteur>>(
      ENDPOINTS.REDACTEUR_BY_ID(id)
    );
    return data.data;
  },

  create: async (RedacteurData: Omit<Redacteur, 'id'>) => {
    const { data } = await apiClient.post<ApiResponse<Redacteur>>(
      ENDPOINTS.REDACTEURS,
      RedacteurData
    );
    return data;
  },

  update: async (id: number, RedacteurData: Partial<Redacteur>) => {
    const { data } = await apiClient.put<ApiResponse<Redacteur>>(
      `${ENDPOINTS.REDACTEURS}/${id}`,
      RedacteurData
    );
    return data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${ENDPOINTS.REDACTEURS}/${id}`);
    return data;
  },

  // Pagination opt-in : renvoie le corps complet (data + meta) pour l'affichage des pages.
  getPage: async (page: number, perPage: number) => {
    const { data } = await apiClient.get(ENDPOINTS.REDACTEURS, {
      params: { page, per_page: perPage },
    });
    return data as { data: Redacteur[]; meta: { current_page: number; last_page: number; total: number } };
  },

  getTrashed: async () => {
    const { data } = await apiClient.get<ApiResponse<Redacteur[]>>(`${ENDPOINTS.REDACTEURS}/trashed`);
    return data.data;
  },

  restore: async (id: number) => {
    const { data } = await apiClient.patch(`${ENDPOINTS.REDACTEURS}/${id}/restore`);
    return data;
  },

  forceDelete: async (id: number) => {
    const { data } = await apiClient.delete(`${ENDPOINTS.REDACTEURS}/${id}/force`);
    return data;
  },
};
