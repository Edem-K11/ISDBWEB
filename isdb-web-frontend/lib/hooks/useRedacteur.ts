

import useSWR from 'swr';
import { redacteurService } from '@/lib/api/services/redacteurService';
import { Redacteur } from '@/lib/types/redacteur';

// `enabled` évite d'appeler l'API (réservée aux admins côté backend) pour un
// redacteur qui n'y a pas accès — sinon la requête échoue systématiquement en 403.
export function useRedacteurs(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<Redacteur[]>(
    enabled ? 'redacteurs' : null,
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

export const REDACTEURS_PER_PAGE = 12;

export function useRedacteursPage(page: number) {
  const { data, error, isLoading, mutate } = useSWR(
    ['redacteurs-page', page],
    () => redacteurService.getPage(page, REDACTEURS_PER_PAGE),
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    redacteurs: (data?.data || []) as Redacteur[],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
}