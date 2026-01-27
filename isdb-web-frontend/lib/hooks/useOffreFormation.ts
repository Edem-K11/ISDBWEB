

import useSWR from 'swr';
import { offreFormationService, OffreFormationFilters } from '@/lib/api/services/offreFormationService';
import { useMemo } from 'react';
import { OffreFormation } from '@/lib/types/OffreFormation';

export function useOffresFormations(filters: OffreFormationFilters = {}) {
  const key = useMemo(() => ['offres-formations', filters], [filters]);
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => offreFormationService.getAll(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    offres: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useOffresActuelles(filters: OffreFormationFilters = {}) {
  const key = useMemo(() => ['offres-formations-actuelles', filters], [filters]);
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    () => offreFormationService.getActuelles(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    offresActuelles: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useOffreFormation(id?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `offre-formation-${id}` : null,
    () => offreFormationService.getById(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    offre: data,
    isLoading,
    isError: error,
    mutate,
  };
}