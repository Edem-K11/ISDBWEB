import { ApiResponse } from '@/lib/types/api';
import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import {
  FormationModulaire,
  FormationModulaireFormData,
  FormationModulaireFilters,
} from '@/lib/types/FormationModulaire';

export const formationModulaireService = {
  /**
   * Récupérer toutes les formations modulaires (dashboard, tous statuts par défaut si précisé)
   */
  getAll: async (filters: FormationModulaireFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.statut) params.append('statut', filters.statut);

    const { data } = await apiClient.get<ApiResponse<FormationModulaire[]>>(
      `${ENDPOINTS.DASHBOARD_FORMATIONS_MODULAIRES}?${params.toString()}`
    );

    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<FormationModulaire>>(
      ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_BY_ID(id)
    );
    return data.data;
  },

  create: async (formData: FormationModulaireFormData) => {
    if (formData.programme_pdf) {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'programme_pdf' && value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value.toString());
          }
        }
      });

      const { data } = await apiClient.post<ApiResponse<FormationModulaire>>(
        ENDPOINTS.DASHBOARD_FORMATIONS_MODULAIRES,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data.data;
    }

    const { data } = await apiClient.post<ApiResponse<FormationModulaire>>(
      ENDPOINTS.DASHBOARD_FORMATIONS_MODULAIRES,
      formData
    );
    return data.data;
  },

  update: async (id: number, formData: Partial<FormationModulaireFormData>) => {
    if (formData.programme_pdf) {
      const payload = new FormData();
      payload.append('_method', 'PUT');
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'programme_pdf' && value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value.toString());
          }
        }
      });

      const { data } = await apiClient.post<ApiResponse<FormationModulaire>>(
        ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_BY_ID(id),
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data.data;
    }

    const { data } = await apiClient.put<ApiResponse<FormationModulaire>>(
      ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_BY_ID(id),
      formData
    );
    return data.data;
  },

  /**
   * Archiver une formation modulaire (soft delete)
   */
  delete: async (id: number) => {
    const { data } = await apiClient.delete(
      ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_BY_ID(id)
    );
    return data;
  },
};
