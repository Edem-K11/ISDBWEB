import apiClient from '@/lib/api/axios';


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
import { redacteurService } from '@/lib/api/services/redacteurService';
import { Redacteur } from '@/lib/types/redacteur';

export function useFormationsTrashed(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<Formation[]>(
    enabled ? 'formations-trashed' : null,
    formationService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { formations: data || [], isLoading, isError: error, mutate };
}

export function useFormationsModulairesTrashed(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<FormationModulaire[]>(
    enabled ? 'formations-modulaires-trashed' : null,
    formationModulaireService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { formations: data || [], isLoading, isError: error, mutate };
}

export function useDomainesTrashed(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<Domaine[]>(
    enabled ? 'domaines-trashed' : null,
    domaineService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { domaines: data || [], isLoading, isError: error, mutate };
}

export function useMentionsTrashed(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<Mention[]>(
    enabled ? 'mentions-trashed' : null,
    mentionService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { mentions: data || [], isLoading, isError: error, mutate };
}

export function useRedacteursTrashed(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<Redacteur[]>(
    enabled ? 'redacteurs-trashed' : null,
    redacteurService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { redacteurs: data || [], isLoading, isError: error, mutate };
}

export function useOffresTrashed(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR<OffreFormation[]>(
    enabled ? 'offres-formations-trashed' : null,
    offreFormationService.getTrashed,
    { revalidateOnFocus: false }
  );

  return { offres: data || [], isLoading, isError: error, mutate };
}

export interface CorbeilleCounts {
  formations: number;
  domaines: number;
  mentions: number;
  offres: number;
  redacteurs: number;
}

export function useCorbeilleCounts() {
  const { data, mutate } = useSWR<CorbeilleCounts>(
    'corbeille-counts',
    async () => {
      const { data: body } = await apiClient.get('/dashboard/corbeille/counts');
      return body.data as CorbeilleCounts;
    },
    { revalidateOnFocus: false }
  );

  return { counts: data, mutateCounts: mutate };
}
