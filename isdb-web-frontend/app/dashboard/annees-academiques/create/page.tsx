

'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { anneeAcademiqueService } from '@/lib/api/services/anneeAcademiqueService';
import { mutate } from 'swr';

export default function CreateAnneePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    annee_debut: currentYear,
    date_debut: '',
    date_fin: '',
  });

  // Calculer automatiquement annee_fin
  const annee_fin = formData.annee_debut + 1;
  const libellePreview = `${formData.annee_debut}-${annee_fin}`;

  // Déterminer si c'est une année passée
  const isAnneePassee = formData.annee_debut < currentYear;
  const isAnneeFuture = formData.annee_debut > currentYear + 1;

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.annee_debut) {
      errors.annee_debut = 'L\'année de début est obligatoire';
    } else if (formData.annee_debut < currentYear - 10) {
      errors.annee_debut = 'L\'année ne peut pas être antérieure à ' + (currentYear - 10);
    } else if (formData.annee_debut > currentYear + 5) {
      errors.annee_debut = 'L\'année ne peut pas dépasser ' + (currentYear + 5);
    }

    if (!formData.date_debut) {
      errors.date_debut = 'La date de début est obligatoire';
    } else {
      const anneeDate = new Date(formData.date_debut).getFullYear();
      if (anneeDate !== formData.annee_debut) {
        errors.date_debut = `La date doit être dans l'année ${formData.annee_debut}`;
      }
    }

    if (!formData.date_fin) {
      errors.date_fin = 'La date de fin est obligatoire';
    } else {
      const anneeDate = new Date(formData.date_fin).getFullYear();
      if (anneeDate !== annee_fin) {
        errors.date_fin = `La date doit être dans l'année ${annee_fin}`;
      }
    }

    if (formData.date_debut && formData.date_fin) {
      if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
        errors.date_fin = 'La date de fin doit être après la date de début';
      }
      
      // Vérifier durée (6-15 mois)
      const debut = new Date(formData.date_debut);
      const fin = new Date(formData.date_fin);
      const diffMonths = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (diffMonths < 6) {
        errors.date_fin = 'Une année académique doit durer au minimum 6 mois';
      } else if (diffMonths > 15) {
        errors.date_fin = 'Une année académique ne peut pas durer plus de 15 mois';
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
      await anneeAcademiqueService.create({
        annee_debut: formData.annee_debut,
        annee_fin: annee_fin,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
      });

      await mutate('annees-academiques');
      toast.success('Année académique créée avec succès');
      router.push('/dashboard/annees-academiques');
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
            <h1 className="text-2xl font-bold text-gray-900">Créer une année académique</h1>
            <p className="text-gray-600 mt-1">
              Définissez une nouvelle année académique pour l'institut
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
          
          {/* Badges de statut */}
          <div className="flex gap-2 mt-3">
            {isAnneePassee && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                Année antérieure
              </span>
            )}
            {isAnneeFuture && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Année future
              </span>
            )}
            {!isAnneePassee && !isAnneeFuture && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Période actuelle
              </span>
            )}
          </div>
        </div>

        {/* Avertissement pour année passée */}
        {isAnneePassee && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 mt-0.5 shrink-0" size={20} />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Création d'une année antérieure</p>
                <p>
                  Vous créez une année académique pour une période passée ({formData.annee_debut}-{annee_fin}). 
                  Assurez-vous que c'est intentionnel (migration de données, corrections).
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
                min={currentYear - 10}
                max={currentYear + 5}
                value={formData.annee_debut}
                onChange={(e) => handleChange('annee_debut', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 ${
                  formErrors.annee_debut ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: 2024"
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
                Année de fin <span className="text-gray-400">(calculée automatiquement)</span>
              </label>
              <input
                type="number"
                value={annee_fin}
                disabled
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg cursor-not-allowed"
              />
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <Info size={14} />
                Toujours égale à l'année de début + 1
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <CheckCircle size={16} className="inline mr-2" />
            Une année académique se déroule toujours sur deux années civiles consécutives
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
                min={`${formData.annee_debut}-01-01`}
                max={`${formData.annee_debut}-12-31`}
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
              <p className="mt-2 text-sm text-gray-500">
                Doit être dans l'année {formData.annee_debut}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={`${annee_fin}-01-01`}
                max={`${annee_fin}-12-31`}
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
              <p className="mt-2 text-sm text-gray-500">
                Doit être dans l'année {annee_fin}
              </p>
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
                    )} jours (~{Math.round(
                      (new Date(formData.date_fin).getTime() - new Date(formData.date_debut).getTime()) 
                      / (1000 * 60 * 60 * 24 * 30)
                    )} mois)
                  </p>
                </div>
              </div>
            </div>
          )}
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
            className="px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[180px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save size={20} />
                Créer l'année académique
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aide */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-3">
          💡 Règles de création
        </h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>L'année de fin est <strong>toujours</strong> égale à l'année de début + 1</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>La date de début doit être dans l'année de début</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>La date de fin doit être dans l'année de fin</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>Durée minimale : 6 mois - Durée maximale : 15 mois</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>Les années antérieures sont autorisées (max 10 ans dans le passé)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}