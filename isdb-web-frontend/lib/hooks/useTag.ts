

import useSWR from 'swr';
import { tagService } from '@/lib/api/services/tagService';
import { Tag } from '@/lib/types/tag';

export function useTags() {
  const { data, error, isLoading, mutate } = useSWR<Tag[]>(
    'tags',
    tagService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    tags: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}