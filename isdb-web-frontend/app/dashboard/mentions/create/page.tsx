

// app/dashboard/mentions/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mentionService } from '@/lib/api/services/mentionService';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { mutate } from 'swr';

export default function CreateMentionPage() {
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [domaineId, setDomaineId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { domaine: domaines, isLoading: isLoadingDomaines } = useDomaines();

  const domaineOptions = domaines.map(domaine => ({
    value: domaine.id,
    label: domaine.nom
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titre.trim()) {
      toast.error('Le titre de la mention est requis');
      return;
    }

    if (!domaineId) {
      toast.error('Veuillez sélectionner un domaine');
      return;
    }

    setIsSubmitting(true);
    try {
      await mentionService.create({
        titre: titre.trim(),
        description: description.trim() || null,
        domaine_id: domaineId as number
      });

      // Revalider les caches
      await Promise.all([
        mutate('Mentions'),
        mutate(`Domaine/${domaineId}/mentions`)
      ]);

      toast.success('Mention créée avec succès');
      router.push('/dashboard/mentions');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDomaines) {
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
          href="/dashboard/mentions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux mentions
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-isdb-green-50 rounded-xl">
            <BookOpen className="text-isdb-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle mention</h1>
            <p className="text-gray-600 mt-1">
              Ajoutez une nouvelle mention à un domaine de formation
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la mention <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Développement Web, Communication Digitale..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine associé <span className="text-red-500">*</span>
            </label>
            <SelectWithSearch
              options={domaineOptions}
              value={domaineId}
              onChange={(value) => setDomaineId(value as number)}
              placeholder="Sélectionnez un domaine"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              La mention sera rattachée à ce domaine
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement cette mention..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-2">
              {description.length}/500 caractères
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
              disabled={isSubmitting || !titre.trim() || !domaineId}
              className="px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Créer la mention
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Aide */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          📚 À propos des mentions
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
            <span>Une mention est une spécialisation au sein d'un domaine</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
            <span>Les formations principales peuvent être associées à une mention</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
            <span>Un domaine peut contenir plusieurs mentions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}