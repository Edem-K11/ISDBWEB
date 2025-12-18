import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Article introuvable
        </h1>
        <p className="text-gray-600 mb-8">
          Désolé, l'article que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link
          href={ENDPOINTS.BLOGS}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retour au blog
        </Link>
      </div>
    </div>
  );
}