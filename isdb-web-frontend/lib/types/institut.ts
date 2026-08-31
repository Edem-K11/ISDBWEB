export interface InstitutReseauxSociaux {
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  whatsapp: string | null;
}

export interface InstitutSettings {
  id: number;
  nom: string;
  logo: string | null;
  galerie: string[];
  description: string | null;
  adresse: string | null;
  maps_url: string | null;
  telephone: string | null;
  telephone_2: string | null;
  email: string | null;
  email_2: string | null;
  fax: string | null;
  site_web: string | null;
  date_ouverture_inscriptions: string | null;
  date_cloture_inscriptions: string | null;
  date_rentree: string | null;
  reseaux_sociaux: InstitutReseauxSociaux;
  updated_at: string | null;
}

export interface InstitutSettingsFormData {
  nom: string;
  logo: string;
  galerie: string[];
  description: string;
  adresse: string;
  maps_url: string;
  telephone: string;
  telephone_2: string;
  email: string;
  email_2: string;
  fax: string;
  site_web: string;
  date_ouverture_inscriptions: string;
  date_cloture_inscriptions: string;
  date_rentree: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  whatsapp: string;
}
