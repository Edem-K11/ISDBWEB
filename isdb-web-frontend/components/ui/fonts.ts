import { Plus_Jakarta_Sans, Lexend_Deca, Playfair_Display, Boldonse } from 'next/font/google';

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Réservée aux grands intitulés éditoriaux (ex: le mot-symbole en superposition
// du hero de l'accueil) — pas destinée au texte courant.
export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
});

// Police display réservée au grand titre du hero de l'accueil (ne fournit
// qu'une seule graisse sur Google Fonts). Boldonse est trop récente pour
// figurer dans la base de métriques de next/font : adjustFontFallback:false
// évite l'avertissement "Failed to find font override values" au build/dev
// (juste une police de repli non ajustée pendant le chargement, sans impact).
export const boldonse = Boldonse({
  subsets: ['latin'],
  weight: ['400'],
  adjustFontFallback: false,
});
