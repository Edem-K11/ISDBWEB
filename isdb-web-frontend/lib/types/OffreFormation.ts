

import { AnneeAcademique } from "./AnneeAcademique";
import { Formation } from "./Formation";

export interface OffreFormation {
  id: number;
  formation_id: number;
  annee_academique_id: number;
  chef_parcours: string | null;
  animateur: string | null;
  date_debut: string | null;
  date_fin: string | null;
  place_limited: number | null;
  prix: string | null; 
  prix_brut: number | null;
  est_dispensee: boolean;
  est_en_cours: boolean;
  est_future: boolean;
  est_passee: boolean;
  a_places_disponibles: boolean;
  formation?: Formation;
  annee_academique?: AnneeAcademique; 
  created_at: string | null;
  updated_at: string | null;
}
