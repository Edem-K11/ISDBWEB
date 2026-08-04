import useSWR from 'swr';
import { studioService } from '@/lib/api/services/studioService';
import { Studio } from '@/lib/api/studios';

export function useStudios() {
  const { data, error, isLoading, mutate } = useSWR<Studio[]>(
    'dashboard-studios',
    studioService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    studios: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
