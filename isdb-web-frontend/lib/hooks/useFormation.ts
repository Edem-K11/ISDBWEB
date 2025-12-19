

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { formationService } from '@/lib/api/services/formationService';
import { Formation, FormationFilters, FormationStats } from '@/lib/types/Formation';

/**
 * Hook pour une formation spécifique
 */
export function useFormation(id?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `formation-${id}` : null,
    () => formationService.getById(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    formation: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook pour la liste des formations avec pagination infinie
 */
export function useFormationsInfinite(filters: FormationFilters = {}) {
  const getKey = (pageIndex: number, previousPageData: Formation[] | null) => {
    // Si on a atteint la fin, ne pas charger plus
    if (previousPageData && previousPageData.length === 0) return null;
    
    // Première page ou page suivante
    return [
      'formations-infinite',
      {
        ...filters,
        page: pageIndex + 1,
        perPage: filters.perPage || 10,
      }
    ];
  };

  const fetcher = async ([_, params]: [string, FormationFilters]) => {
    return formationService.getAll(params);
  };

  const { data, error, size, setSize, mutate, isLoading, isValidating } = useSWRInfinite<Formation[]>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  // Aplatir toutes les pages en un seul tableau
  const formations = data ? data.flat() : [];

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < (filters.perPage || 10));

  return {
    formations,
    isLoading,
    isLoadingMore,
    isError: error,
    isEmpty,
    isReachingEnd,
    size,
    setSize,
    mutate,
    isValidating,
  };
}

/**
 * Hook pour toutes les formations (sans pagination)
 */
export function useFormations(filters: FormationFilters = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ['formations', filters],
    () => formationService.getAll(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    formations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook pour les statistiques des formations
 */
export function useFormationStats() {
  const { data, error, isLoading, mutate } = useSWR<FormationStats>(
    'formation-stats',
    () => formationService.getGlobalStats(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  };
}