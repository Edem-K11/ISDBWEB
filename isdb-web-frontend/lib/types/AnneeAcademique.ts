

import { OffreFormation } from "./OffreFormation";

export interface AnneeAcademique {
  id: number;
  annee_debut: number;
  annee_fin: number;
  libelle: string;
  est_actuelle: boolean;
  date_debut: string | null;
  date_fin: string | null;
  offres_formations?: OffreFormation[]; 
  nombre_offres?: number;
  created_at: string | null;
  updated_at: string | null;
}
