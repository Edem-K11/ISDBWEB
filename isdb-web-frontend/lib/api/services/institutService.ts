import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { InstitutSettings, InstitutSettingsFormData } from '@/lib/types/institut';
import { ApiResponse } from '@/lib/types/api';

export const institutService = {
  getSettings: async () => {
    const { data } = await apiClient.get<ApiResponse<InstitutSettings>>(ENDPOINTS.INSTITUT);
    return data.data;
  },

  update: async (settings: Partial<InstitutSettingsFormData>) => {
    const { data } = await apiClient.put<ApiResponse<InstitutSettings>>(
      ENDPOINTS.DASHBOARD_INSTITUT,
      settings
    );
    return data.data;
  },
};
