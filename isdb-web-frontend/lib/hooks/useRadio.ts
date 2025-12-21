

import useSWR from 'swr';
import { radioService } from '@/lib/api/services/radioService';
import { Radio } from '@/lib/types/radio';

/**
 * Hook pour récupérer LA radio (il n'y en a qu'une)
 */
export function useRadio() {
  const { data, error, isLoading, mutate } = useSWR<Radio>(
    'radio',
    radioService.get,
    {
      revalidateOnFocus: true,
      dedupingInterval: 300000,
    }
  );

  return {
    radio: data,
    isLoading,
    isError: error,
    mutate,
  };
}