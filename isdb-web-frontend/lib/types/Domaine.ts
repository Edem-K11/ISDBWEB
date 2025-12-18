
import { Mention } from "./Mention";

export interface Domaine {
  id: number;
  nom: string;
  mentions?: Mention[];
  nombreMentions?: number;
  nombreFormations?: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DomaineFormData {
  nom: string;
}