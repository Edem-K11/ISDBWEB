
import { Domaine } from "./Domaine";
import { Formation } from "./Formation";

export interface Mention {
  id: number;
  titre: string;
  description: string | null;
  domaine_id: number;
  domaine?: Domaine;
  formations?: Formation[];
  nom_complet?: string;
  nombre_formations?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MentionFormData {
  titre: string;
  description?: string | null;
  domaine_id: number;
}
