import { ApiResponse } from "@/lib/types/api";
import apiClient from "../axios";
import { ENDPOINTS } from "../endpoints";
import { Domaine, DomaineFormData } from "@/lib/types/Domaine";


export const domaineService = {
    getAll: async () => {
        const { data } = await apiClient.get<ApiResponse<Domaine[]>>(ENDPOINTS.DASHBOARD_DOMAINES);
        return data.data;
    },

    getById: async (id: number) => {
        const { data } = await apiClient.get<ApiResponse<Domaine>>(ENDPOINTS.DASHBOARD_DOMAINE_BY_ID(id));
        return data.data;
    },

    create: async (domaineData: DomaineFormData) => { 
        const { data } = await apiClient.post<ApiResponse<Domaine>>(
            ENDPOINTS.DASHBOARD_DOMAINES,
            domaineData
        );
        return data.data; // Retourner data.data au lieu de data
    },

    update: async (id: number, domaineData: Partial<DomaineFormData>) => {
        const { data } = await apiClient.put<ApiResponse<Domaine>>(
            ENDPOINTS.DASHBOARD_DOMAINE_BY_ID(id),
            domaineData
        );
        return data.data;
    },

    delete: async (id: number) => {
        const { data } = await apiClient.delete(ENDPOINTS.DASHBOARD_DOMAINE_BY_ID(id));
        return data;
    },
};