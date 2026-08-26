const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { Mention } from '@/lib/types/Mention';

export async function getMentions(): Promise<Mention[]> {
  try {
    const res = await fetch(`${API_URL}/formations`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}
