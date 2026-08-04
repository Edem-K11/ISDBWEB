import useSWR from 'swr';
import { institutService } from '@/lib/api/services/institutService';

export function useInstitutSettings() {
  const { data, error, isLoading, mutate } = useSWR(
    'institut-settings',
    institutService.getSettings,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    settings: data,
    isLoading,
    isError: error,
    mutate,
  };
}
