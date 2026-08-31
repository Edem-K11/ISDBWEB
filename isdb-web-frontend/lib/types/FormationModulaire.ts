import { StatutFormation } from './Formation';

export interface FormationModulaire {
  id: number;
  titre: string;
  slug: string;
  description?: string | null;
  contenu?: string | null;
  condition_admission?: string | null;
  objectifs?: string | null;
  competences_visees?: string | null;
  debouches?: string | null;
  profile_sortie?: string | null;
  evaluation?: string | null;
  programme?: string | null;
  programme_pdf?: string | null;
  duree_heures?: number | null;
  frais_inscription?: number | null;
  frais_formation?: number | null;
  statut_formation: StatutFormation;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface FormationModulaireFormData {
  titre: string;
  description?: string;
  contenu?: string;
  condition_admission?: string;
  objectifs?: string;
  competences_visees?: string;
  debouches?: string;
  profile_sortie?: string;
  evaluation?: string;
  programme?: string;
  programme_pdf?: File | null;
  duree_heures?: number;
  frais_inscription?: number;
  frais_formation?: number;
  statut_formation?: StatutFormation;
}

export interface FormationModulaireFilters {
  search?: string;
  statut?: StatutFormation | '';
}
