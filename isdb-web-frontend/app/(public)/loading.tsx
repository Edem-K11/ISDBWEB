import { Loader2 } from 'lucide-react';

// Fallback affiché pendant le rendu serveur de n'importe quelle page publique
// (le temps que ses fetch côté serveur répondent). Avant ce fichier, la
// navigation restait figée sur un écran blanc sans aucun indicateur.
export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-isdb-green-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
}
