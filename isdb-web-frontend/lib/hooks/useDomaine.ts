



import useSWR from 'swr';
import { domaineService } from '@/lib/api/services/domaineService';
import { Domaine } from '@/lib/types/Domaine';

export function useDomaines() {
  const { data, error, isLoading, mutate } = useSWR<Domaine[]>(
    'Domaines',
    domaineService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    domaine: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}