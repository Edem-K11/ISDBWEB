import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { Studio } from '@/lib/api/studios';
import { ApiResponse } from '@/lib/types/api';

export interface StudioFormData {
  nom: string;
  description: string;
  images: string[];
  ordre: number;
  lien_radio: boolean;
  est_actif: boolean;
}

export const studioService = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Studio[]>>(ENDPOINTS.DASHBOARD_STUDIOS);
    return data.data;
  },

  create: async (studioData: Partial<StudioFormData>) => {
    const { data } = await apiClient.post<ApiResponse<Studio>>(
      ENDPOINTS.DASHBOARD_STUDIOS,
      studioData
    );
    return data.data;
  },

  update: async (id: number, studioData: Partial<StudioFormData>) => {
    const { data } = await apiClient.put<ApiResponse<Studio>>(
      ENDPOINTS.DASHBOARD_STUDIO_BY_ID(id),
      studioData
    );
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(ENDPOINTS.DASHBOARD_STUDIO_BY_ID(id));
    return data;
  },
};
