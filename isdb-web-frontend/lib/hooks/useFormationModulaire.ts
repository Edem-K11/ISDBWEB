import useSWR from 'swr';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import { FormationModulaireFilters } from '@/lib/types/FormationModulaire';

/**
 * Hook pour la liste des formations modulaires (dashboard, sans pagination)
 */
export function useFormationModulaires(filters: FormationModulaireFilters = {}, enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? ['formations-modulaires-dashboard', filters] : null,
    () => formationModulaireService.getAll(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    formationsModulaires: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook pour une formation modulaire spécifique
 */
export function useFormationModulaire(id?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `formation-modulaire-${id}` : null,
    () => formationModulaireService.getById(id!),
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
