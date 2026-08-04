const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { InstitutSettings } from '@/lib/types/institut';

export async function getInstitutSettings(): Promise<InstitutSettings | null> {
  try {
    const res = await fetch(`${API_URL}/institut`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}
