

import { ApiResponse } from "@/lib/types/api";
import apiClient from "../axios";
import { Radio, RadioFormData } from "@/lib/types/radio";
import { ENDPOINTS } from "../endpoints";


export const radioService = {
  /**
   * Récupérer LA radio (publique)
   */
  get: async () => {
    const { data } = await apiClient.get<ApiResponse<Radio>>(ENDPOINTS.RADIO);
    return data.data;
  },

  /**
   * Mettre à jour la radio (admin)
   */
  update: async (radioData: Partial<RadioFormData>) => {
    const payload: any = {};
    
    if (radioData.nom) payload.nom = radioData.nom;
    if (radioData.urlStream) payload.url_stream = radioData.urlStream;
    if (radioData.image !== undefined) payload.image = radioData.image;
    if (radioData.enDirect !== undefined) payload.en_direct = radioData.enDirect;
    if (radioData.description !== undefined) payload.description = radioData.description;

    const { data } = await apiClient.put<ApiResponse<Radio>>(
      ENDPOINTS.DASHBOARD_RADIO,
      payload
    );
    return data.data;
  },

  /**
   * Toggle le statut en direct
   */
  toggleLive: async () => {
    const { data } = await apiClient.post<ApiResponse<Radio>>(
      ENDPOINTS.DASHBOARD_RADIO_TOGGLE_LIVE
    );
    return data.data;
  },
};