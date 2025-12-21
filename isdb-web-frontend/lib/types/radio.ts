export interface Radio {
  id: number;
  nom: string;
  urlStream: string;
  image: string | null;
  enDirect: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RadioFormData {
  nom: string;
  urlStream: string;
  image?: string | null;
  enDirect?: boolean;
  description?: string;
}