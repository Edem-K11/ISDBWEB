

// app/dashboard/domaines/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { domaineService } from '@/lib/api/services/domaineService';
import { useDomaines } from '@/lib/hooks/useDomaine';

export default function EditDomainePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [nom, setNom] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { mutate } = useDomaines();

  useEffect(() => {
    const loadDomaine = async () => {
      try {
        const domaine = await domaineService.getById(id);
        setNom(domaine.nom);
      } catch (error: any) {
        toast.error('Erreur lors du chargement du domaine');
        router.push('/dashboard/domaines');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadDomaine();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom.trim()) {
      toast.error('Le nom du domaine est requis');
      return;
    }

    setIsSubmitting(true);
    try {
      await domaineService.update(id, { nom: nom.trim() });

      // Revalider les données
      mutate();

      toast.success('Domaine modifié avec succès');
      router.push('/dashboard/domaines');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/domaines"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux domaines
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-isdb-green-50 rounded-xl">
            <Globe className="text-isdb-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier le domaine</h1>
            <p className="text-gray-600 mt-1">
              Modifiez les informations de ce domaine de formation
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du domaine <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Informatique, Multimédia, Communication..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent transition-all"
                maxLength={100}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                {nom.length}/100
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Le nom doit être clair et représentatif du domaine
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nom.trim()}
              className="px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-3">Informations</h3>
        <ul className="text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
            <span>Un domaine peut être associé à plusieurs mentions</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
            <span>Les formations principales doivent appartenir à un domaine</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
            <span>La modification du nom sera répercutée partout</span>
          </li>
        </ul>
      </div>
    </div>
  );
}