/**
 * Certains navigateurs bloquent l'affichage de Google Maps en iframe (X-Frame-Options)
 * quand le lien vient d'un autre site. On récupère donc simplement une URL cliquable
 * (en s'accommodant d'un ancien lien "Intégrer une carte" ou output=embed déjà collé)
 * pour ouvrir la position dans un nouvel onglet plutôt que de l'intégrer.
 */
export function getMapsHref(mapsUrl?: string | null): string | null {
  if (!mapsUrl) return null;

  const value = mapsUrl.trim();
  if (!value) return null;

  const iframeMatch = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  const url = iframeMatch ? iframeMatch[1] : value;

  try {
    const parsed = new URL(url);
    parsed.searchParams.delete('output');
    return parsed.toString();
  } catch {
    return url;
  }
}
