import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { ContactMessage, ContactMessageFormData } from '@/lib/types/contactMessage';
import { ApiResponse } from '@/lib/types/api';

export const contactMessageService = {
  send: async (formData: ContactMessageFormData) => {
    const { data } = await apiClient.post<ApiResponse<ContactMessage>>(
      ENDPOINTS.CONTACT,
      formData
    );
    return data.data;
  },

  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<ContactMessage[]>>(ENDPOINTS.DASHBOARD_MESSAGES);
    return data.data;
  },

  get: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<ContactMessage>>(ENDPOINTS.DASHBOARD_MESSAGE_BY_ID(id));
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(ENDPOINTS.DASHBOARD_MESSAGE_BY_ID(id));
    return data;
  },
};
