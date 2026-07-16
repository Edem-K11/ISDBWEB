const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FormationModulaireListItem {
  id: number;
  numero_module: number | null;
  titre: string;
  slug: string;
  description: string | null;
  contenu: string | null;
  duree_heures: number | null;
  duree_formation: string | null;
  offre: {
    frais_inscription: number | null;
    frais_formation: number | null;
  } | null;
}

export async function getFormationsModulaires(): Promise<FormationModulaireListItem[]> {
  try {
    const res = await fetch(`${API_URL}/formations-modulaires`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export function formatFcfa(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}
