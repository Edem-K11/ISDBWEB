const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { Mention } from '@/lib/types/Mention';

export async function getMentions(): Promise<Mention[]> {
  try {
    // Revalidate court (60s) plutôt que no-store : no-store forçait un aller-retour
    // live vers Render (plan gratuit, cold-start possible) à CHAQUE visite, ce qui
    // alourdissait le chargement perçu. Avec 60s, la page profite du cache la
    // plupart du temps, et si jamais une régénération tombe sur un cold-start raté,
    // elle s'auto-corrige en 1 minute max (contre 1h avec l'ancien revalidate:3600
    // qui avait causé une page figée vide — voir commit 77adbf8).
    const res = await fetch(`${API_URL}/formations`, {
      next: { revalidate: 60, tags: ['formations'] },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}
