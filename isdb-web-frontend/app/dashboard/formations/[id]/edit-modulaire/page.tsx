

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, BookOpen, AlertCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formationService } from '@/lib/api/services/formationService';
import { useFormation } from '@/lib/hooks/useFormation';
import { mutate } from 'swr';

export default function EditFormationModulairePage() {
  const router = useRouter();
  const params = useParams();
  const formationId = Number(params.id);
  
  const { formation, isLoading: isLoadingFormation, mutate: mutateFormation } = useFormation(formationId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    duree_formation: '',
    frais_scolarite: '',
  });

  // Charger les données de la formation
  useEffect(() => {
    if (formation) {
      // Vérifier si c'est bien une formation modulaire
      if (formation.type_formation !== 'MODULAIRE') {
        toast.error('Cette formation n\'est pas modulaire');
        router.push('/dashboard/formations');
        return;
      }

      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        titre: formation.titre || '',
        description: formation.description || '',
        duree_formation: formation.duree_formation || '',
        frais_scolarite: formation.frais_scolarite || '',
      });
    }
  }, [formation, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      errors.titre = 'Le titre de la formation est requis';
    }

    if (!formData.duree_formation.trim()) {
      errors.duree_formation = 'La durée est requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        titre: formData.titre.trim(),
        description: formData.description.trim() || undefined,
        duree_formation: formData.duree_formation.trim(),
        frais_scolarite: formData.frais_scolarite.trim() || undefined,
      };

      await formationService.update(formationId, updateData);

      // Revalider les données
      await mutateFormation();
      await mutate(
        key => typeof key === 'string' && key.startsWith('formations'),
        undefined,
        { revalidate: true }
      );

      toast.success('Formation modulaire mise à jour avec succès');
      router.push('/dashboard/formations');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // États de chargement
  if (isLoadingFormation) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-isdb-green-600 animate-spin mb-4" />
          <p className="text-gray-600">Chargement de la formation...</p>
        </div>
      </div>
    );
  }

  // Si la formation n'existe pas
  if (!formation) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Formation non trouvée</h2>
          <p className="text-gray-600 mb-6">
            La formation que vous essayez de modifier n'existe pas ou a été supprimée.
          </p>
          <Link
            href="/dashboard/formations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/formations"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux formations
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-600 rounded-xl">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier la formation modulaire</h1>
            <p className="text-gray-600 mt-1">
              Modifiez les informations de l'atelier/formation courte
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire simple */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la formation modulaire <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Ex: Atelier de photographie numérique..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                formErrors.titre ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {formErrors.titre && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.titre}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez brièvement le contenu de l'atelier/formation..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              maxLength={300}
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.description.length}/300 caractères
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Clock className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  value={formData.duree_formation}
                  onChange={(e) => handleChange('duree_formation', e.target.value)}
                  placeholder="Ex: 3 jours, 20 heures, 1 semaine..."
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    formErrors.duree_formation ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {formErrors.duree_formation && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.duree_formation}
                </p>
              )}
            </div>

            {/* Frais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais (optionnel)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  value={formData.frais_scolarite}
                  onChange={(e) => handleChange('frais_scolarite', e.target.value)}
                  placeholder="Ex: 50 000 FCFA, Gratuit..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Statut (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut de la formation
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="statut"
                  value="ACTIVE"
                  checked={formation.statut_formation === 'ACTIVE'}
                  disabled
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="statut"
                  value="ARCHIVEE"
                  checked={formation.statut_formation === 'ARCHIVEE'}
                  disabled
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                />
                <span className="text-gray-700">Archivée</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Pour archiver cette formation, utilisez le bouton "Archiver" sur la page de liste.
            </p>
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
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-8 space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <BookOpen size={20} />
            À propos des formations modulaires
          </h3>
          <ul className="text-green-800 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
              <span>Ateliers pratiques, séminaires, ou formations courtes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
              <span>Indépendantes des domaines et mentions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
              <span>L'animateur sera défini lors de la création d'offre</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0" />
              <span>Les dates précises seront spécifiées dans les offres</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">
            📝 Informations techniques
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Type :</span>
              <span className="font-medium">Formation modulaire</span>
            </div>
            <div className="flex justify-between">
              <span>Diplôme :</span>
              <span className="font-medium">Certificat Module</span>
            </div>
            <div className="flex justify-between">
              <span>Créée le :</span>
              <span>{new Date(formation.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Dernière modification :</span>
              <span>{new Date(formation.updatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}