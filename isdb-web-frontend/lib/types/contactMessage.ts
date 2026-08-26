export interface ContactMessage {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageFormData {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}
