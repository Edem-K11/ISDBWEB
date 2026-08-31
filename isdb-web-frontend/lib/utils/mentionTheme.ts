// Source unique de vérité pour les couleurs associées aux mentions/formations.
// Utilisée par la carte de /formations, la page de détail d'une mention et la
// page de détail d'une formation, pour garantir que la même mention affiche
// toujours la même couleur, où qu'elle apparaisse.
// Doit rester synchronisé avec les classes .theme-* définies dans app/globals.css.

export type MentionTheme = 'green' | 'red' | 'gold' | 'orange';

const MENTION_THEMES: Set<MentionTheme> = new Set(['green', 'red', 'gold', 'orange']);

export function normalizeMentionTheme(theme?: string | null): MentionTheme {
  return MENTION_THEMES.has(theme as MentionTheme) ? (theme as MentionTheme) : 'green';
}

interface MentionThemePalette {
  /** Dégradé de fond du hero (page mention et page formation) */
  gradient: string;
  /** Couleur hexadécimale d'accent (ex: contour de texte décoratif) */
  accentHex: string;
  /** Fond clair (bg-X-50) */
  bg: string;
  /** Bordure discrète (border-X-100) */
  border: string;
  /** Bordure plus marquée (border-X-200), utilisée sur les cartes */
  borderStrong: string;
  /** Bordure marquée au survol (hover:border-X-200) */
  hoverBorderStrong: string;
  /** Texte de la couleur d'accent (text-X-700) */
  text: string;
  /** Fond plein pour badges/boutons (bg-X-600) */
  accentBg: string;
  /** Survol léger (hover:bg-X-50) */
  hoverBg: string;
  /** Dégradé clair pour fond de carte (from-X-50 to-X-100) */
  cardGradient: string;
  /** Survol de l'accent de carte (group-hover:bg-X-700) */
  cardHover: string;
  /** Dégradé plus soutenu (from-X-400 to-X-300), pour les tuiles "Découvrez aussi" */
  tileGradient: string;
  /** Fond plein pastel (bg-X-200), pour les cartes pleine couleur (ex: accueil) */
  solidBg: string;
  /** Couleur du motif décoratif (cauris) en filigrane sur fond plein (text-X-500) */
  decorative: string;
}

export const MENTION_THEME_PALETTE: Record<MentionTheme, MentionThemePalette> = {
  green: {
    gradient: 'from-isdb-green-800 via-isdb-green-600 to-isdb-green-500',
    accentHex: '#206b38',
    bg: 'bg-isdb-green-50',
    border: 'border-isdb-green-100',
    borderStrong: 'border-isdb-green-200',
    hoverBorderStrong: 'hover:border-isdb-green-200',
    text: 'text-isdb-green-700',
    accentBg: 'bg-isdb-green-600',
    hoverBg: 'hover:bg-isdb-green-50',
    cardGradient: 'from-isdb-green-50 to-isdb-green-100',
    cardHover: 'group-hover:bg-isdb-green-700',
    tileGradient: 'from-isdb-green-400 to-isdb-green-300',
    solidBg: 'bg-isdb-green-200',
    decorative: 'text-isdb-green-500',
  },
  red: {
    gradient: 'from-isdb-red-800 via-isdb-red-600 to-isdb-red-500',
    accentHex: '#dc2c42',
    bg: 'bg-isdb-red-50',
    border: 'border-isdb-red-100',
    borderStrong: 'border-isdb-red-200',
    hoverBorderStrong: 'hover:border-isdb-red-200',
    text: 'text-isdb-red-700',
    accentBg: 'bg-isdb-red-600',
    hoverBg: 'hover:bg-isdb-red-50',
    cardGradient: 'from-isdb-red-50 to-isdb-red-100',
    cardHover: 'group-hover:bg-isdb-red-700',
    tileGradient: 'from-isdb-red-400 to-isdb-red-300',
    solidBg: 'bg-isdb-red-200',
    decorative: 'text-isdb-red-500',
  },
  gold: {
    gradient: 'from-isdb-gold-800 via-isdb-gold-600 to-isdb-gold-500',
    accentHex: '#968464',
    bg: 'bg-isdb-gold-50',
    border: 'border-isdb-gold-100',
    borderStrong: 'border-isdb-gold-200',
    hoverBorderStrong: 'hover:border-isdb-gold-200',
    text: 'text-isdb-gold-700',
    accentBg: 'bg-isdb-gold-600',
    hoverBg: 'hover:bg-isdb-gold-50',
    cardGradient: 'from-isdb-gold-50 to-isdb-gold-100',
    cardHover: 'group-hover:bg-isdb-gold-700',
    tileGradient: 'from-isdb-gold-400 to-isdb-gold-300',
    solidBg: 'bg-isdb-gold-200',
    decorative: 'text-isdb-gold-500',
  },
  orange: {
    gradient: 'from-isdb-orange-800 via-isdb-orange-600 to-isdb-orange-500',
    accentHex: '#967e62',
    bg: 'bg-isdb-orange-50',
    border: 'border-isdb-orange-100',
    borderStrong: 'border-isdb-orange-200',
    hoverBorderStrong: 'hover:border-isdb-orange-200',
    text: 'text-isdb-orange-700',
    accentBg: 'bg-isdb-orange-600',
    hoverBg: 'hover:bg-isdb-orange-50',
    cardGradient: 'from-isdb-orange-50 to-isdb-orange-100',
    cardHover: 'group-hover:bg-isdb-orange-700',
    tileGradient: 'from-isdb-orange-400 to-isdb-orange-300',
    solidBg: 'bg-isdb-orange-200',
    decorative: 'text-isdb-orange-700',
  },
};

export function getMentionThemePalette(theme?: string | null): MentionThemePalette {
  return MENTION_THEME_PALETTE[normalizeMentionTheme(theme)];
}
