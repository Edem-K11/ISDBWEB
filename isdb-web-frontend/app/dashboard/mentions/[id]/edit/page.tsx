

// app/dashboard/mentions/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, BookOpen, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mentionService } from '@/lib/api/services/mentionService';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function EditMentionPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    domaine_id: '' as number | '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { domaine: domaines, mutate: mutateDomaines } = useDomaines();

  useEffect(() => {
    const loadMention = async () => {
      try {
        setIsLoading(true);
        const mention = await mentionService.getById(id);
        
        setFormData({
          titre: mention.titre,
          description: mention.description || '',
          domaine_id: mention.domaine_id,
        });
      } catch (error: any) {
        toast.error('Erreur lors du chargement de la mention');
        router.push('/dashboard/mentions');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadMention();
    }
  }, [id, router]);

  const domaineOptions = domaines.map(domaine => ({
    value: domaine.id,
    label: domaine.nom
  }));

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      errors.titre = 'Le titre de la mention est requis';
    } else if (formData.titre.length > 100) {
      errors.titre = 'Le titre ne doit pas dépasser 100 caractères';
    }

    if (!formData.domaine_id) {
      errors.domaine_id = 'Veuillez sélectionner un domaine';
    }

    if (formData.description.length > 500) {
      errors.description = 'La description ne doit pas dépasser 500 caractères';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur commence à modifier
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await mentionService.update(id, {
        titre: formData.titre.trim(),
        description: formData.description.trim() || null,
        domaine_id: formData.domaine_id as number
      });

      // Revalider les caches
      Promise.all([
        // Invalider la liste des mentions
        fetch('/api/revalidate?path=/dashboard/mentions'),
        // Invalider la liste des domaines (pour le compteur de mentions)
        mutateDomaines(),
      ]);

      toast.success('Mention modifiée avec succès');
      router.push(ENDPOINTS.DASHBOARD_MENTIONS);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      
      // Gestion spécifique des erreurs de validation du backend
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const newErrors: Record<string, string> = {};
        
        Object.keys(validationErrors).forEach(key => {
          newErrors[key] = validationErrors[key][0];
        });
        
        setFormErrors(newErrors);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement de la mention...</p>
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Modifier la mention</h1>
            <p className="text-gray-600 mt-1">
              Modifiez les informations de cette mention
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la mention <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Ex: Développement Web, Communication Digitale..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent transition-all ${
                formErrors.titre ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {formErrors.titre && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    {formErrors.titre}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {formData.titre.length}/100
              </div>
            </div>
          </div>

          {/* Champ Domaine */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine associé <span className="text-red-500">*</span>
            </label>
            <SelectWithSearch
              options={domaineOptions}
              value={formData.domaine_id}
              onChange={(value) => handleChange('domaine_id', value)}
              placeholder="Sélectionnez un domaine"
              error={formErrors.domaine_id}
            />
            <p className="text-sm text-gray-500 mt-2">
              La mention sera rattachée à ce domaine
            </p>
          </div>

          {/* Champ Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez brièvement cette mention..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent resize-none ${
                formErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {formErrors.description && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    {formErrors.description}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {formData.description.length}/500
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.titre.trim() || !formData.domaine_id}
              className="px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[180px]"
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

      {/* Informations et avertissements */}
      <div className="mt-6 space-y-6">
        {/* Avertissements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Avertissements
          </h3>
          <ul className="text-yellow-800 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
              <span>La modification du domaine peut affecter les formations existantes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
              <span>Les formations associées à cette mention doivent être vérifiées après modification</span>
            </li>
          </ul>
        </div>

        {/* Conseils */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-medium text-gray-900 mb-3">
            Bonnes pratiques
          </h3>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
              <span>Un titre clair et précis facilite la recherche et l'attribution</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
              <span>La description doit être concise mais informative</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
              <span>Pensez à vérifier les formations associées après modification</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}