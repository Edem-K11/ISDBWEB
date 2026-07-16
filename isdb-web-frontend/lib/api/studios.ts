const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Studio {
  id: number;
  nom: string;
  slug: string;
  description: string | null;
  images: string[];
  ordre: number;
  lien_radio: boolean;
  est_actif: boolean;
}

export async function getStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(`${API_URL}/studios`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function getStudioBySlug(slug: string): Promise<Studio | null> {
  try {
    const res = await fetch(`${API_URL}/studios/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}
