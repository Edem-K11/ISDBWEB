const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { Mention } from '@/lib/types/Mention';

export async function getMentions(): Promise<Mention[]> {
  try {
    // Pas de cache ISR ici : le backend est hébergé sur le plan gratuit de
    // Render, qui se met en veille après inactivité. Avec `revalidate`, une
    // régénération en arrière-plan qui tombe sur un cold-start peut échouer
    // (timeout) et figer une page vide en cache pendant toute la durée du
    // revalidate. `no-store` force un fetch live à chaque requête, comme sur
    // les pages de détail de mention/formation (voir getMentionData).
    const res = await fetch(`${API_URL}/formations`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}
