

import { ApiResponse } from "@/lib/types/api";
import apiClient from "../axios";
import { ENDPOINTS } from "../endpoints";
import { OffreFormation } from "@/lib/types/OffreFormation";

export interface OffreFormationFormData {
  formation_id: number;
  annee_academique_id: number;
  chef_parcours?: string;
  animateur?: string;
  date_debut?: string;
  date_fin?: string;
  place_limited?: number;
  prix?: number;
  est_dispensee?: boolean;
}

export interface OffreFormationFilters {
  search?: string;
  annee_academique_id?: number | '';
  formation_id?: number | '';
  type_formation?: 'PRINCIPALE' | 'MODULAIRE' | '';
  dispensees_only?: boolean;
  domaine_id?: number | '';
  mention_id?: number | '';
  page?: number;
  perPage?: number;
}

export const offreFormationService = {
  getAll: async (filters: OffreFormationFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.annee_academique_id) params.append('annee_academique_id', filters.annee_academique_id.toString());
    if (filters.formation_id) params.append('formation_id', filters.formation_id.toString());
    if (filters.type_formation) params.append('type_formation', filters.type_formation);
    if (filters.dispensees_only) params.append('dispensees_only', 'true');
    if (filters.domaine_id) params.append('domaine_id', filters.domaine_id.toString());
    if (filters.mention_id) params.append('mention_id', filters.mention_id.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.perPage) params.append('per_page', filters.perPage.toString());

    const { data } = await apiClient.get<ApiResponse<OffreFormation[]>>(
      `${ENDPOINTS.DASHBOARD_OFFRES_FORMATIONS}?${params.toString()}`
    );
    
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<OffreFormation>>(
      ENDPOINTS.DASHBOARD_OFFRE_FORMATION_BY_ID(id)
    );
    return data.data;
  },

  getActuelles: async (filters: OffreFormationFilters = {}) => {
    const params = new URLSearchParams();
    params.append('annee_actuelle', 'true');
    
    if (filters.type_formation) params.append('type_formation', filters.type_formation);
    if (filters.domaine_id) params.append('domaine_id', filters.domaine_id.toString());
    if (filters.mention_id) params.append('mention_id', filters.mention_id.toString());

    const { data } = await apiClient.get<ApiResponse<OffreFormation[]>>(
      `${ENDPOINTS.DASHBOARD_OFFRES_FORMATIONS}/actuelles?${params.toString()}`
    );
    
    return data.data;
  },

  create: async (offreData: OffreFormationFormData) => {
    const { data } = await apiClient.post<ApiResponse<OffreFormation>>(
      ENDPOINTS.DASHBOARD_OFFRES_FORMATIONS,
      offreData
    );
    return data.data;
  },

  update: async (id: number, offreData: Partial<OffreFormationFormData>) => {
    const { data } = await apiClient.put<ApiResponse<OffreFormation>>(
      ENDPOINTS.DASHBOARD_OFFRE_FORMATION_BY_ID(id),
      offreData
    );
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(
      ENDPOINTS.DASHBOARD_OFFRE_FORMATION_BY_ID(id)
    );
    return data;
  },

  toggleDispensee: async (id: number) => {
    const { data } = await apiClient.patch<ApiResponse<OffreFormation>>(
      ENDPOINTS.DASHBOARD_OFFRE_FORMATION_TOGGLE_DISPENSEE(id)
    );
    return data.data;
  },

  duplicate: async (id: number, annee_academique_id: number) => {
    const { data } = await apiClient.post<ApiResponse<OffreFormation>>(
      `${ENDPOINTS.DASHBOARD_OFFRE_FORMATION_BY_ID(id)}/duplicate`,
      { annee_academique_id }
    );
    return data.data;
  },

  getStatistics: async (id: number) => {
    const { data } = await apiClient.get(
      `${ENDPOINTS.DASHBOARD_OFFRE_FORMATION_BY_ID(id)}/statistics`
    );
    return data.data;
  },
};