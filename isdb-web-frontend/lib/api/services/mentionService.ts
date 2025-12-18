

import { ApiResponse } from "@/lib/types/api";
import apiClient from "../axios";
import { ENDPOINTS } from "../endpoints";
import { Mention, MentionFormData } from "@/lib/types/Mention";


export const mentionService = {
  getAll: async (): Promise<Mention[]> => {
    const { data } = await apiClient.get<ApiResponse<Mention[]>>(ENDPOINTS.DASHBOARD_MENTIONS);
    return data.data;
  },

  getById: async (id: number): Promise<Mention> => {
    const { data } = await apiClient.get<ApiResponse<Mention>>(ENDPOINTS.DASHBOARD_MENTION_BY_ID(id));
    return data.data;
  },

  
  getByDomaine: async (domaineId: number): Promise<Mention[]> => {
    const { data } = await apiClient.get<ApiResponse<Mention[]>>(`/domaines/${domaineId}/mentions`);
    return data.data;
  },
  
  create: async (mentionData: MentionFormData): Promise<Mention> => {
    const { data } = await apiClient.post<ApiResponse<Mention>>(ENDPOINTS.DASHBOARD_MENTIONS, mentionData);
    return data.data;
  },
  
  update: async (id: number, mentionData: Partial<MentionFormData>): Promise<Mention> => {
    const { data } = await apiClient.put<ApiResponse<Mention>>(ENDPOINTS.DASHBOARD_MENTION_EDIT(id), mentionData);
    return data.data;
  },
  
  delete: async (id: number)=> {
    const {data} = await apiClient.delete(ENDPOINTS.DASHBOARD_MENTION_BY_ID(id));
    return data.data;
  },

};