
import { ApiResponse } from "@/lib/types/api";
import apiClient from "../axios";
import { ENDPOINTS } from "../endpoints";
import { AnneeAcademique } from "@/lib/types/AnneeAcademique";

export interface AnneeAcademiqueFormData {
  annee_debut: number;
  annee_fin: number;
  date_debut: string;
  date_fin: string;
  est_actuelle?: boolean;
}

export interface ReconduireOffresData {
  annee_cible_id: number;
  offre_ids?: number[];
}

export const anneeAcademiqueService = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<AnneeAcademique[]>>(
      ENDPOINTS.DASHBOARD_ANNEES_ACADEMIQUES
    );
    return data.data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<AnneeAcademique>>(
      ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(id)
    );
    return data.data;
  },

  getActuelle: async () => {
    const { data } = await apiClient.get<ApiResponse<AnneeAcademique>>(
      `${ENDPOINTS.DASHBOARD_ANNEES_ACADEMIQUES}/actuelle`
    );
    return data.data;
  },

  create: async (anneeData: AnneeAcademiqueFormData) => {
    const { data } = await apiClient.post<ApiResponse<AnneeAcademique>>(
      ENDPOINTS.DASHBOARD_ANNEES_ACADEMIQUES,
      anneeData
    );
    return data.data;
  },

  update: async (id: number, anneeData: Partial<AnneeAcademiqueFormData>) => {
    const { data } = await apiClient.put<ApiResponse<AnneeAcademique>>(
      ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(id),
      anneeData
    );
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(
      ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(id)
    );
    return data;
  },

  setActuelle: async (id: number) => {
    const { data } = await apiClient.patch<ApiResponse<AnneeAcademique>>(
      `${ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(id)}/set-actuelle`
    );
    return data.data;
  },

  reconduireOffres: async (anneeSourceId: number, reconduireData: ReconduireOffresData) => {
    const { data } = await apiClient.post(
      `${ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(anneeSourceId)}/reconduire-offres`,
      reconduireData
    );
    return data;
  },

  getOffres: async (id: number) => {
    const { data } = await apiClient.get(
      `${ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(id)}/offres`
    );
    return data.data;
  },

  getStatistics: async (id: number) => {
    const { data } = await apiClient.get(
      `${ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_BY_ID(id)}/statistics`
    );
    return data.data;
  },
};