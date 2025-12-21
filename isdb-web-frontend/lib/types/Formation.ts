

import { Domaine } from "./Domaine";
import { Mention } from "./Mention";
import { OffreFormation } from "./OffreFormation";

export enum TypeFormation {
  PRINCIPALE = "PRINCIPALE",
  MODULAIRE = "MODULAIRE",
}

export enum Diplome {
  LICENCE_PROFESSIONNELLE = "LICENCE_PROFESSIONNELLE",
  LICENCE_FONDAMENTALE = "LICENCE_FONDAMENTALE",
  MASTER = "MASTER",
  CERTIFICAT_MODULE = "CERTIFICAT_MODULE",
}

export enum StatutFormation {
  ACTIVE = "ACTIVE",
  ARCHIVEE = "ARCHIVEE",
  SUPPRIMEE = "SUPPRIMEE",
}

export interface Formation {
  id: number;
  titre: string;
  type_formation: TypeFormation;
  description?: string | null;
  mention_id?: number | null;
  diplome?: Diplome | null;

  // Informations pédagogiques
  condition_admission?: string | null;
  profile_intree?: string | null;
  specialite?: string | null;
  objectifs?: string | null;
  profile_sortie?: string | null;
  evaluation?: string | null;
  programme?: string | null;
  programme_pdf?: string | null;

  // Informations pratiques
  duree_formation?: string | null;
  frais_scolarite?: string | null;

  statut_formation: StatutFormation;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Relations (chargées conditionnellement)
  domaine?: Domaine;
  mention?: Mention;
  offresFormations?: OffreFormation[];
  offreActuelle?: OffreFormation;
  
  
  // Accessors
  estPrincipale?: boolean;
  estModulaire?: boolean;
  estActive?: boolean;
}

export interface FormationWithRelations extends Formation {
  domaine: Domaine;
  mention?: Mention;
  offresFormations: OffreFormation[];
}

export interface FormationFormData {
  titre: string;
  type_formation: TypeFormation;
  description?: string;
  mention_id?: number;
  diplome?: Diplome;
  
  // Informations pédagogiques
  condition_admission?: string;
  profile_intree?: string;
  specialite?: string;
  objectifs?: string;
  profile_sortie?: string;
  evaluation?: string;
  programme?: string;
  programme_pdf?: File | null;
  
  // Informations pratiques
  duree_formation?: string;
  frais_scolarite?: string;
  
  statut_formation?: StatutFormation;
}

export interface FormationFilters {
  search?: string;
  type?: TypeFormation | '';
  domaine_id?: number | '';
  mention_id?: number | '';
  diplome?: Diplome | '';
  statut?: StatutFormation | '';
  page?: number;
  perPage?: number;
}

export interface FormationStats {
  total: number;
  actives: number;
  principales: number;
  modulaires: number;
  parDiplome: {
    diplome: Diplome;
    count: number;
  }[];
  parDomaine: {
    domaine: string;
    count: number;
  }[];
}