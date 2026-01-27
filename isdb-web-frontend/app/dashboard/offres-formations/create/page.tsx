

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar, Users, AlertCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { useFormations } from '@/lib/hooks/useFormation';
import { useAnneesAcademiques } from '@/lib/hooks/useAnneeAcademique';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { StatutFormation } from '@/lib/types/Formation';
import { mutate } from 'swr';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function CreateOffrePage() {
  const router = useRouter();
  const { formations } = useFormations({ statut: StatutFormation.ACTIVE });
  const { annees } = useAnneesAcademiques();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedFormation, setSelectedFormation] = useState<any>(null);

  const [formData, setFormData] = useState({
    formation_id: '' as number | '',
    annee_academique_id: '' as number | '',
    chef_parcours: '',
    animateur: '',
    date_debut: '',
    date_fin: '',
    place_limited: '',
    est_dispensee: false,
  });

  // Définir l'année actuelle par défaut
  useEffect(() => {
    const anneeActuelle = annees.find(a => a.est_actuelle);
    if (anneeActuelle && !formData.annee_academique_id) {
      setFormData(prev => ({ ...prev, annee_academique_id: anneeActuelle.id }));
    }
  }, [annees]);

  // Gérer le changement de formation
  useEffect(() => {
    if (formData.formation_id) {
      const formation = formations.find(f => f.id === formData.formation_id);
      setSelectedFormation(formation);
      
      // RESET des champs spécifiques quand on change de formation
      setFormData(prev => ({
        ...prev,
        chef_parcours: '',
        animateur: '',
        date_debut: '',
        date_fin: '',
        place_limited: '',
        est_dispensee: false,
      }));
      
      // Réinitialiser les erreurs
      setFormErrors({});
    } else {
      setSelectedFormation(null);
    }
  }, [formData.formation_id, formations]);

  const isFormationPrincipale = selectedFormation?.type_formation === 'PRINCIPALE';
  const isFormationModulaire = selectedFormation?.type_formation === 'MODULAIRE';

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.formation_id) {
      errors.formation_id = 'La formation est obligatoire';
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend: any = {
        formation_id: formData.formation_id,
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

      await offreFormationService.create(dataToSend);

      await mutate(
        key => Array.isArray(key) && key[0] === 'offres-formations',
        undefined,
        { revalidate: true }
      );
      
      toast.success('Offre de formation créée avec succès');
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

  const formationOptions = formations.map(f => ({
    value: f.id,
    label: `${f.titre} (${f.type_formation === 'PRINCIPALE' ? 'Principale' : 'Modulaire'})`,
  }));

  const anneeOptions = annees.map(a => ({
    value: a.id,
    label: `${a.libelle}${a.est_actuelle ? ' (En cours)' : ''}`,
  }));

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
            <h1 className="text-2xl font-bold text-gray-900">Créer une offre de formation</h1>
            <p className="text-gray-600 mt-1">
              Proposez une formation pour une année académique
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formation <span className="text-red-500">*</span>
              </label>
              <SelectWithSearch
                options={formationOptions}
                value={formData.formation_id}
                onChange={(value) => handleChange('formation_id', value)}
                placeholder="Sélectionnez une formation"
                error={formErrors.formation_id}
              />
              {selectedFormation && (
                <div className={`mt-2 p-3 rounded-lg text-sm ${
                  isFormationPrincipale ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'
                }`}>
                  <div className="flex items-start gap-2">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">
                        {isFormationPrincipale ? 'Formation Principale' : 'Formation Modulaire'}
                      </p>
                      {isFormationPrincipale && (
                        <p className="mt-1">
                          Cette formation se déroule sur toute la durée de l'année académique. 
                          Les dates ne sont pas requises.
                        </p>
                      )}
                      {isFormationModulaire && (
                        <p className="mt-1">
                          Cette formation nécessite des dates de début et de fin précises.
                        </p>
                      )}
                      {selectedFormation.diplome && (
                        <p className="mt-1">Diplôme : {selectedFormation.diplome.replace(/_/g, ' ')}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
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
            </div>
          </div>
        </div>

        {/* Responsables */}
        {selectedFormation && (
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
        )}

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
        {selectedFormation && (
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
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.formation_id || !formData.annee_academique_id}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[180px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save size={20} />
                Créer l'offre
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-3">
          💡 Conseils pour créer une offre
        </h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>Une même formation ne peut être offerte qu'une fois par année académique</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>Le chef de parcours est obligatoire pour les formations principales</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>L'animateur et les dates sont obligatoires pour les formations modulaires</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
            <span>Les formations principales se déroulent sur toute l'année académique</span>
          </li>
        </ul>
      </div>
    </div>
  );
}