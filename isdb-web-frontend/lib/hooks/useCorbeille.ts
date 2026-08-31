

// lib/hooks/useCorbeille.ts
//
// Hooks de lecture pour la vue Corbeille du dashboard : un hook par ressource
// soft-supprimable, chacun ciblant l'endpoint /trashed correspondant. Groupés
// ici plutôt que dans les fichiers de hooks existants car ils ne servent
// qu'à cet unique écran.

import useSWR from 'swr';
import { formationService } from '@/lib/api/services/formationService';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import { domaineService } from '@/lib/api/services/domaineService';
import { mentionService } from '@/lib/api/services/mentionService';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { Formation } from '@/lib/types/Formation';
import { FormationModulaire } from '@/lib/types/FormationModulaire';
import { Domaine } from '@/lib/types/Domaine';
import { Mention } from '@/lib/types/Mention';
import { OffreFormation } from '@/lib/types/OffreFormation';

export function useFormationsTrashed() {
  const { data, error, isLoading, mutate } = useSWR<Formation[]>(
    'formations-trashed',
    formationService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { formations: data || [], isLoading, isError: error, mutate };
}

export function useFormationsModulairesTrashed() {
  const { data, error, isLoading, mutate } = useSWR<FormationModulaire[]>(
    'formations-modulaires-trashed',
    formationModulaireService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { formations: data || [], isLoading, isError: error, mutate };
}

export function useDomainesTrashed() {
  const { data, error, isLoading, mutate } = useSWR<Domaine[]>(
    'domaines-trashed',
    domaineService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { domaines: data || [], isLoading, isError: error, mutate };
}

export function useMentionsTrashed() {
  const { data, error, isLoading, mutate } = useSWR<Mention[]>(
    'mentions-trashed',
    mentionService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { mentions: data || [], isLoading, isError: error, mutate };
}

export function useOffresTrashed() {
  const { data, error, isLoading, mutate } = useSWR<OffreFormation[]>(
    'offres-formations-trashed',
    offreFormationService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { offres: data || [], isLoading, isError: error, mutate };
}
