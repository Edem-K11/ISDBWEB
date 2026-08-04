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
  telephone: string | null;
  email: string | null;
  fax: string | null;
  site_web: string | null;
  reseaux_sociaux: InstitutReseauxSociaux;
  updated_at: string | null;
}

export interface InstitutSettingsFormData {
  nom: string;
  logo: string;
  galerie: string[];
  description: string;
  adresse: string;
  telephone: string;
  email: string;
  fax: string;
  site_web: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
  tiktok_url: string;
  whatsapp: string;
}
