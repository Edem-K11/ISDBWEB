
import { Redacteur } from './redacteur';
import { Tag } from './tag';

export interface Blog {
  id: number;
  slug: string;
  titre: string;
  resume: string;
  contenu: string;
  coverImage: string;
  redacteur: Redacteur;
  tags: Tag[];
  dateCreation: string;
  dateModification: string;
  statut: 'brouillon' | 'publie';
}

export interface BlogFormData {
  titre: string;
  resume: string;
  contenu: string;
  cover_image: string;
  redacteur_id: number;
  tags: number[];
  statut: 'brouillon' | 'publie';
}

export interface BlogFilters {
  statut?: 'publie' | 'brouillon';
  tag?: string;
  search?: string;
  redacteur_id?: number;
  page?: number;
  annee?: string;
}