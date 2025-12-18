

import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { Tag } from '@/lib/types/tag';
import { ApiResponse } from '@/lib/types/api';

export const tagService = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Tag[]>>(ENDPOINTS.TAGS);
    // response.data === { data: Tag[], meta?:..., links?:... }
    return data.data; // <-- on renvoie uniquement le tableau
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Tag>>(
      ENDPOINTS.TAG_BY_SLUG(slug)
    );
    return data.data;
  },

  create: async (tagData: Omit<Tag, 'id' | 'slug'>) => {
    const { data } = await apiClient.post<ApiResponse<Tag>>(
      ENDPOINTS.ADMIN_TAGS,
      tagData
    );
    return data;
  },

  update: async (id: number, tagData: Partial<Tag>) => {
    const { data } = await apiClient.put<ApiResponse<Tag>>(
      `${ENDPOINTS.ADMIN_TAGS}/${id}`,
      tagData
    );
    return data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${ENDPOINTS.ADMIN_TAGS}/${id}`);
    return data;
  },
};
