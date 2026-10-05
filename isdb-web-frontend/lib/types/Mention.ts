
import { Domaine } from "./Domaine";
import { Formation } from "./Formation";

export interface Mention {
  id: number;
  titre: string;
  slug: string;
  description: string | null;
  domaine_id: number;
  domaine?: Domaine;
  formations?: Formation[];
  nom_complet?: string;
  nombre_formations?: number;
  theme?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface MentionFormData {
  titre: string;
  description?: string | null;
  domaine_id: number;
}

export interface MentionPageContentForm {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  section_title: string | null;
  section_description: string | null;
  cta_title: string | null;
  cta_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  theme: 'green' | 'orange' | 'red' | 'gold';
}
