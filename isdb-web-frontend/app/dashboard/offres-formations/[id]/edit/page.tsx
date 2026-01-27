

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar, Users, AlertCircle, Loader2, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { useOffreFormation } from '@/lib/hooks/useOffreFormation';
import { useAnneesAcademiques } from '@/lib/hooks/useAnneeAcademique';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { mutate } from 'swr';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function EditOffrePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { offre, isLoading: isLoadingOffre } = useOffreFormation(id);
  const { annees } = useAnneesAcademiques();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    annee_academique_id: '' as number | '',
    chef_parcours: '',
    animateur: '',
    date_debut: '',
    date_fin: '',
    place_limited: '',
    est_dispensee: false,
  });

  useEffect(() => {
    if (offre) {
      setFormData({
        annee_academique_id: offre.annee_academique_id,
        chef_parcours: offre.chef_parcours || '',
        animateur: offre.animateur || '',
        date_debut: offre.date_debut || '',
        date_fin: offre.date_fin || '',
        place_limited: offre.place_limited ? offre.place_limited.toString() : '',
        est_dispensee: offre.est_dispensee,
      });
    }
  }, [offre]);

  const isFormationPrincipale = offre?.formation?.type_formation === 'PRINCIPALE';
  const isFormationModulaire = offre?.formation?.type_formation === 'MODULAIRE';

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.annee_academique_id) {
      errors.annee_academique_id = 'L\'année académique est obligatoire';
    }

    // Validation pour formation PRINCIPALE
    if (isFormationPrincipale && !formData.chef_parcours.trim()) {
      errors.chef_parcours = 'Le chef de parcours est obligatoire pour une formation principale';
    }

    // Validation pour formation MODULAIRE
    if (isFormationModulaire) {
      if (!formData.animateur.trim()) {
        errors.animateur = 'L\'animateur est obligatoire pour une formation modulaire';
      }

      if (!formData.date_debut) {
        errors.date_debut = 'La date de début est obligatoire pour une formation modulaire';
      }

      if (!formData.date_fin) {
        errors.date_fin = 'La date de fin est obligatoire pour une formation modulaire';
      }

      if (formData.date_debut && formData.date_fin) {
        if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
          errors.date_fin = 'La date de fin doit être après la date de début';
        }
      }

      if (formData.place_limited && parseInt(formData.place_limited) < 0) {
        errors.place_limited = 'Le nombre de places ne peut pas être négatif';
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
      const dataToSend: any = {
        annee_academique_id: formData.annee_academique_id,
        est_dispensee: formData.est_dispensee,
      };

      // Données pour formation PRINCIPALE
      if (isFormationPrincipale) {
        if (formData.chef_parcours.trim()) {
          dataToSend.chef_parcours = formData.chef_parcours.trim();
        }
      }

      // Données pour formation MODULAIRE
      if (isFormationModulaire) {
        if (formData.animateur.trim()) {
          dataToSend.animateur = formData.animateur.trim();
        }

        if (formData.date_debut) {
          dataToSend.date_debut = formData.date_debut;
        }

        if (formData.date_fin) {
          dataToSend.date_fin = formData.date_fin;
        }

        if (formData.place_limited) {
          dataToSend.place_limited = parseInt(formData.place_limited);
        }
      }

      await offreFormationService.update(id, dataToSend);

      await mutate(
        key => Array.isArray(key) && key[0] === 'offres-formations',
        undefined,
        { revalidate: true }
      );

      await mutate(`offre-formation-${id}`);

      toast.success('Offre de formation mise à jour avec succès');
      router.push(ENDPOINTS.DASHBOARD_OFFRES_FORMATIONS);
      router.refresh();
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

  const anneeOptions = annees.map(a => ({
    value: a.id,
    label: `${a.libelle}${a.est_actuelle ? ' (En cours)' : ''}`,
  }));

  if (isLoadingOffre) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-isdb-green-800 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Offre non trouvée</p>
          <Link
            href="/dashboard/offres-formations"
            className="text-indigo-600 hover:underline"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/offres-formations"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux offres
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier l'offre de formation</h1>
            <p className="text-gray-600 mt-1">
              {offre.formation?.titre}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Informations principales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Informations principales
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Formation</p>
              <p className="font-medium text-gray-900">{offre.formation?.titre}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isFormationPrincipale
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isFormationPrincipale ? 'Principale' : 'Modulaire'}
                </span>
                {offre.formation?.diplome && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                    {offre.formation.diplome.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              
              {isFormationPrincipale && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                  <Info size={12} className="inline mr-1" />
                  Formation sur toute l'année académique
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année académique <span className="text-red-500">*</span>
              </label>
              <SelectWithSearch
                options={anneeOptions}
                value={formData.annee_academique_id}
                onChange={(value) => handleChange('annee_academique_id', value)}
                placeholder="Sélectionnez une année"
                error={formErrors.annee_academique_id}
              />
              <p className="text-sm text-gray-500 mt-2">
                ⚠️ Attention : Changer l'année peut créer un doublon si cette formation est déjà offerte pour la nouvelle année
              </p>
            </div>
          </div>
        </div>

        {/* Responsables */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Responsables
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {isFormationPrincipale && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chef de parcours <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.chef_parcours}
                    onChange={(e) => handleChange('chef_parcours', e.target.value)}
                    placeholder="Nom du chef de parcours"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.chef_parcours ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.chef_parcours && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.chef_parcours}
                  </p>
                )}
              </div>
            )}

            {isFormationModulaire && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animateur <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.animateur}
                    onChange={(e) => handleChange('animateur', e.target.value)}
                    placeholder="Nom de l'animateur"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.animateur ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.animateur && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.animateur}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dates et détails pratiques - UNIQUEMENT pour formations MODULAIRES */}
        {isFormationModulaire && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Dates et détails pratiques
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de places (optionnel)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.place_limited}
                  onChange={(e) => handleChange('place_limited', e.target.value)}
                  placeholder="Ex: 30"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.place_limited ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.place_limited && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.place_limited}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Laissez vide si le nombre de places est illimité
                </p>
              </div>
            </div>

            {formData.date_debut && formData.date_fin && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="text-blue-600 mt-0.5 shrink-0" size={18} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Durée de la formation</p>
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
        )}

        {/* Statut de l'offre */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Statut de l'offre
          </h2>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.est_dispensee}
              onChange={(e) => handleChange('est_dispensee', e.target.checked)}
              className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Marquer comme dispensée
              </span>
              <p className="text-sm text-gray-500 mt-1">
                L'offre sera visible et accessible aux étudiants
              </p>
            </div>
          </label>
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
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[200px]"
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
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
          <AlertCircle size={20} />
          Informations importantes
        </h3>
        <ul className="text-yellow-800 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 shrink-0" />
            <span>La formation associée ne peut pas être modifiée. Créez une nouvelle offre si nécessaire.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 shrink-0" />
            <span>Changer l'année académique peut créer un doublon. Vérifiez avant de sauvegarder.</span>
          </li>
          {isFormationPrincipale && (
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 shrink-0" />
              <span>Cette formation principale se déroule sur toute la durée de l'année académique.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}