

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { anneeAcademiqueService } from '@/lib/api/services/anneeAcademiqueService';
import { useAnneeAcademique } from '@/lib/hooks/useAnneeAcademique';
import { mutate } from 'swr';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function EditAnneePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { annee, isLoading: isLoadingAnnee } = useAnneeAcademique(id);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    annee_debut: 0,
    annee_fin: 0,
    date_debut: '',
    date_fin: '',
  });

  useEffect(() => {
    if (annee) {
      setFormData({
        annee_debut: annee.annee_debut,
        annee_fin: annee.annee_fin,
        date_debut: annee.date_debut || '',
        date_fin: annee.date_fin || '',
      });
    }
  }, [annee]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.annee_debut) {
      errors.annee_debut = 'L\'année de début est obligatoire';
    } else if (formData.annee_debut < 2000 || formData.annee_debut > 2100) {
      errors.annee_debut = 'L\'année doit être entre 2000 et 2100';
    }

    if (!formData.annee_fin) {
      errors.annee_fin = 'L\'année de fin est obligatoire';
    } else if (formData.annee_fin < 2000 || formData.annee_fin > 2100) {
      errors.annee_fin = 'L\'année doit être entre 2000 et 2100';
    }

    if (formData.annee_fin <= formData.annee_debut) {
      errors.annee_fin = 'L\'année de fin doit être supérieure à l\'année de début';
    }

    if (!formData.date_debut) {
      errors.date_debut = 'La date de début est obligatoire';
    }

    if (!formData.date_fin) {
      errors.date_fin = 'La date de fin est obligatoire';
    }

    if (formData.date_debut && formData.date_fin) {
      if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
        errors.date_fin = 'La date de fin doit être après la date de début';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    setIsSubmitting(true);
    try {
      await anneeAcademiqueService.update(id, {
        annee_debut: formData.annee_debut,
        annee_fin: formData.annee_fin,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
      });

      await mutate('annees-academiques');
      await mutate(`annee-academique-${id}`);

      toast.success('Année académique mise à jour avec succès');
      router.push(ENDPOINTS.DASHBOARD_ANNEES_ACADEMIQUES);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const newErrors: Record<string, string> = {};
          Object.keys(validationErrors).forEach(key => {
            newErrors[key] = validationErrors[key][0];
          });
          setFormErrors(newErrors);
        }
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAnnee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-isdb-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!annee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Année académique non trouvée</p>
          <Link
            href="/dashboard/annees-academiques"
            className="text-isdb-green-600 hover:underline"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const libellePreview = `${formData.annee_debut}-${formData.annee_fin}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/annees-academiques"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux années académiques
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-isdb-green-600 rounded-xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier l'année académique</h1>
            <p className="text-gray-600 mt-1">
              {annee.libelle}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Aperçu du libellé */}
        <div className="bg-gradient-to-br from-isdb-green-50 to-green-50 rounded-xl border border-isdb-green-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-isdb-green-600" size={20} />
            <p className="text-sm font-medium text-isdb-green-900">Aperçu du libellé</p>
          </div>
          <p className="text-3xl font-bold text-isdb-green-900">{libellePreview}</p>
        </div>

        {/* Avertissement si année actuelle */}
        {annee.est_actuelle && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 mt-0.5 shrink-0" size={20} />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Année actuellement active</p>
                <p>
                  Cette année est définie comme actuelle. Les modifications peuvent affecter 
                  les offres de formation en cours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Période académique */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Période académique
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année de début <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={formData.annee_debut}
                onChange={(e) => handleChange('annee_debut', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 ${
                  formErrors.annee_debut ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.annee_debut && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.annee_debut}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année de fin <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={formData.annee_fin}
                onChange={(e) => handleChange('annee_fin', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 ${
                  formErrors.annee_fin ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.annee_fin && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.annee_fin}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            <AlertCircle size={16} className="inline mr-2" />
            Modifier les années peut créer un doublon. Vérifiez qu'aucune autre année n'existe déjà avec ces valeurs.
          </div>
        </div>

        {/* Dates précises */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Dates précises
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date_debut}
                onChange={(e) => handleChange('date_debut', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 ${
                  formErrors.date_debut ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.date_debut && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.date_debut}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date_fin}
                onChange={(e) => handleChange('date_fin', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 ${
                  formErrors.date_fin ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.date_fin && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.date_fin}
                </p>
              )}
            </div>
          </div>

          {formData.date_debut && formData.date_fin && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-blue-600 mt-0.5 shrink-0" size={18} />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Durée de l'année académique</p>
                  <p>
                    {Math.ceil(
                      (new Date(formData.date_fin).getTime() - new Date(formData.date_debut).getTime()) 
                      / (1000 * 60 * 60 * 24)
                    )} jours
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statut automatique */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            Année actuelle automatique
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 mt-0.5 shrink-0" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Détection automatique</p>
                <p>
                  Le système détermine automatiquement quelle année est actuelle en fonction 
                  des dates. Modifier les dates peut changer l'année considérée comme actuelle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
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
      </div>

      {/* Informations */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-3">
          Informations sur les modifications
        </h3>
        <ul className="text-gray-600 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
            <span>Les offres de formation associées ne seront pas affectées</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
            <span>Seule une année peut être définie comme actuelle à la fois</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
            <span>Les dates peuvent être modifiées librement</span>
          </li>
        </ul>
      </div>
    </div>
  );
}