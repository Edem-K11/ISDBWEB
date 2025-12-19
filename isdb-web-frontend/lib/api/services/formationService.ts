

import { ApiResponse, PaginatedResponse } from "@/lib/types/api";
import apiClient from "../axios";
import { ENDPOINTS } from "../endpoints";
import { Formation, FormationFormData, FormationFilters } from "@/lib/types/Formation";

export const formationService = {
  /**
   * Récupérer toutes les formations avec filtres et pagination
   */
  getAll: async (filters: FormationFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.domaine_id) params.append('domaine_id', filters.domaine_id.toString());
    if (filters.mention_id) params.append('mention_id', filters.mention_id.toString());
    if (filters.diplome) params.append('diplome', filters.diplome);
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.perPage) params.append('per_page', filters.perPage.toString());

    const { data } = await apiClient.get<ApiResponse<Formation[]>>(
      `${ENDPOINTS.DASHBOARD_FORMATIONS}?${params.toString()}`
    );
    
    return data.data;
  },

  /**
   * Récupérer une formation par ID
   */
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Formation>>(
      ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id)
    );
    return data.data;
  },

  /**
   * Créer une nouvelle formation
   */
  create: async (formationData: FormationFormData) => {
    // Si un fichier PDF est présent, utiliser FormData
    if (formationData.programme_pdf) {
      const formData = new FormData();
      
      Object.entries(formationData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'programme_pdf' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const { data } = await apiClient.post<ApiResponse<Formation>>(
        ENDPOINTS.DASHBOARD_FORMATIONS,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data.data;
    }

    // Sinon, envoyer en JSON classique
    const { data } = await apiClient.post<ApiResponse<Formation>>(
      ENDPOINTS.DASHBOARD_FORMATIONS,
      formationData
    );
    return data.data;
  },

  /**
   * Mettre à jour une formation
   */
  update: async (id: number, formationData: Partial<FormationFormData>) => {
    // Si un fichier PDF est présent, utiliser FormData
    if (formationData.programme_pdf) {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel method spoofing
      
      Object.entries(formationData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'programme_pdf' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const { data } = await apiClient.post<ApiResponse<Formation>>(
        ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data.data;
    }

    // Sinon, PUT classique
    const { data } = await apiClient.put<ApiResponse<Formation>>(
      ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id),
      formationData
    );
    return data.data;
  },

  /**
   * Archiver une formation (soft delete)
   */
  archive: async (id: number) => {
    const { data } = await apiClient.patch<ApiResponse<Formation>>(
      `${ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id)}/archive`
    );
    return data.data;
  },

  /**
   * Supprimer une formation
   */
  delete: async (id: number) => {
    const { data } = await apiClient.delete(
      ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id)
    );
    return data;
  },

  /**
   * Récupérer les offres d'une formation
   */
  getOffres: async (id: number) => {
    const { data } = await apiClient.get(
      `${ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id)}/offres`
    );
    return data.data;
  },

  /**
   * Récupérer les statistiques d'une formation
   */
  getStats: async (id: number) => {
    const { data } = await apiClient.get(
      `${ENDPOINTS.DASHBOARD_FORMATION_BY_ID(id)}/statistics`
    );
    return data.data;
  },

  /**
   * Récupérer les statistiques globales
   */
  getGlobalStats: async () => {
    const { data } = await apiClient.get(
      `${ENDPOINTS.DASHBOARD_FORMATIONS}/statistics`
    );
    return data.data;
  },
};