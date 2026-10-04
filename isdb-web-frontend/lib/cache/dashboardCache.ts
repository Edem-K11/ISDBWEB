import type { Cache } from 'swr';

// Cache SWR persistant du dashboard : les listes déjà chargées s'affichent tout de
// suite au retour sur une page, puis sont mises à jour en arrière-plan.
// Seules les listes de gestion sont conservées — jamais la session ni les identifiants.

const PREFIXE = 'isdb-dash-cache:';

const AUTORISE = /formation|offre|annee|redacteur|corbeille|mention|domaine|studio|blog|tag/i;
const INTERDIT = /user|auth|token|password|profil|profile|login/i;

export function clefAutorisee(cle: string): boolean {
  return AUTORISE.test(cle) && !INTERDIT.test(cle);
}

export function creerCacheDashboard(): Cache<any> {
  const memoire = new Map<string, unknown>();

  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (cle?.startsWith(PREFIXE)) {
          const brut = localStorage.getItem(cle);
          if (brut) memoire.set(cle.slice(PREFIXE.length), JSON.parse(brut));
        }
      }
    } catch {
      // Stockage indisponible (navigation privée, quota) : on continue en mémoire seule.
    }
  }

  const persister = memoire as Map<string, unknown> & {
    set: (cle: string, valeur: unknown) => Map<string, unknown>;
    delete: (cle: string) => boolean;
  };

  const setOriginal = Map.prototype.set.bind(memoire);
  const deleteOriginal = Map.prototype.delete.bind(memoire);

  persister.set = (cle: string, valeur: unknown) => {
    setOriginal(cle, valeur);
    if (typeof window !== 'undefined' && clefAutorisee(cle)) {
      try {
        localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur));
      } catch {
        // Quota dépassé : la donnée reste disponible en mémoire pour cette session.
      }
    }
    return memoire;
  };

  persister.delete = (cle: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(PREFIXE + cle);
      } catch {
        // ignoré
      }
    }
    return deleteOriginal(cle);
  };

  return persister as unknown as Cache<any>;
}

// À appeler à la déconnexion : aucune donnée du dashboard ne doit rester sur le poste.
export function viderCacheDashboard(): void {
  if (typeof window === 'undefined') return;
  try {
    const aSupprimer: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (cle?.startsWith(PREFIXE)) aSupprimer.push(cle);
    }
    aSupprimer.forEach((cle) => localStorage.removeItem(cle));
  } catch {
    // ignoré
  }
}
