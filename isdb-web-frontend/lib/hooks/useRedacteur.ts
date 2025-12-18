

import useSWR from 'swr';
import { redacteurService } from '@/lib/api/services/redacteurService';
import { Redacteur } from '@/lib/types/redacteur';

export function useRedacteurs() {
  const { data, error, isLoading, mutate } = useSWR<Redacteur[]>(
    'redacteurs',
    redacteurService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    redacteurs: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}