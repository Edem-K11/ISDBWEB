

export interface Formation {
  id: number;
  titre: string;
  type_formation: "PRINCIPALE" | "MODULAIRE";
  description?: string | null;
  mention_id?: number | null;
  diplome?: 
    | "LICENCE_PROFESSIONNELLE"
    | "LICENCE_FONDAMENTALE"
    | "MASTER"
    | "CERTIFICAT_MODULE"
    | null;

  condition_admission?: string | null;
  profile_intree?: string | null;
  specialite?: string | null;
  objectifs?: string | null;
  profile_sortie?: string | null;
  evaluation?: string | null;
  programme?: string | null;
  programme_pdf?: string | null;

  duree_formation?: string | null;
  frais_scolarite?: string | null;

  statut_formation: "ACTIVE" | "ARCHIVEE" | "SUPPRIMEE";

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
