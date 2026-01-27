

import useSWR from 'swr';
import { anneeAcademiqueService } from '@/lib/api/services/anneeAcademiqueService';
import { AnneeAcademique } from '@/lib/types/AnneeAcademique';

export function useAnneesAcademiques() {
  const { data, error, isLoading, mutate } = useSWR<AnneeAcademique[]>(
    'annees-academiques',
    anneeAcademiqueService.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    annees: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAnneeAcademique(id?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `annee-academique-${id}` : null,
    () => anneeAcademiqueService.getById(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    annee: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAnneeActuelle() {
  const { data, error, isLoading, mutate } = useSWR<AnneeAcademique>(
    'annee-academique-actuelle',
    anneeAcademiqueService.getActuelle,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    anneeActuelle: data,
    isLoading,
    isError: error,
    mutate,
  };
}