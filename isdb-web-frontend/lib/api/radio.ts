const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { Radio } from '@/lib/types/radio';

export async function getRadio(): Promise<Radio | null> {
  try {
    const res = await fetch(`${API_URL}/radio`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}
