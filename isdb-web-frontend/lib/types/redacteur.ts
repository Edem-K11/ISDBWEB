
export interface Redacteur {
  est_actif: unknown;
  id: number;
  nom: string;
  email: string;
  avatar?: string | null;
  role: 'admin' | 'redacteur';
  bio?: string;
  password?: string;
  blogsPubliesCount?: number;
}

export interface RedacteurFormData {
  nom: string;
  email: string;
  bio?: string;
  avatar?: string;
  password?: string;
  role: 'admin' | 'redacteur';
}
