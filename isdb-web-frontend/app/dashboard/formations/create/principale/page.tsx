

// app/dashboard/formations/create/principale/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save,
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  BookOpen,
  Target,
  Users,
  FileText,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formationService } from '@/lib/api/services/formationService';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { useMentions } from '@/lib/hooks/useMention';
import { MultiStepForm } from '@/components/ui/multiStepForm';
import RichTextEditor from '@/components/ui/richTextEditor';
import { FileUpload } from '@/components/ui/fileUpload';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { mutate } from 'swr';

// Définition des étapes
const FORM_STEPS = [
  {
    id: 'informations',
    title: 'Informations générales',
    description: 'Titre et description',
    icon: <GraduationCap size={18} />,
  },
  {
    id: 'domaine',
    title: 'Domaine et diplôme',
    description: 'Classification',
    icon: <BookOpen size={18} />,
  },
  {
    id: 'pedagogie',
    title: 'Pédagogie',
    description: 'Objectifs et programme',
    icon: <Target size={18} />,
    optional: true,
  },
  {
    id: 'admission',
    title: 'Admission',
    description: 'Conditions et profils',
    icon: <Users size={18} />,
    optional: true,
  },
  {
    id: 'programme',
    title: 'Programme',
    description: 'PDF détaillé',
    icon: <FileText size={18} />,
    optional: true,
  },
];

export default function CreateFormationPrincipalePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('informations');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { domaine: domaines } = useDomaines();
  const { mentions } = useMentions();

  const [formData, setFormData] = useState({
    // Étape 1: Informations générales
    titre: '',
    description: '',
    
    // Étape 2: Domaine et diplôme
    domaine_id: '' as number | '',
    mention_id: '' as number | '',
    diplome: '' as '' | 'LICENCE_PROFESSIONNELLE' | 'LICENCE_FONDAMENTALE' | 'MASTER',
    duree_formation: '',
    frais_scolarite: '',
    
    // Étape 3: Pédagogie
    objectifs: '',
    programme: '',
    specialite: '',
    profile_sortie: '',
    
    // Étape 4: Admission
    condition_admission: '',
    profile_intree: '',
    evaluation: '',
    
    // Étape 5: Programme
    programme_pdf: null as File | null,
  });

  const currentIndex = FORM_STEPS.findIndex(step => step.id === currentStep);
  const isLastStep = currentIndex === FORM_STEPS.length - 1;

  // Filtre des mentions par domaine sélectionné
  const filteredMentions = formData.domaine_id
    ? mentions.filter(m => m.domaine_id === formData.domaine_id)
    : [];

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 'informations':
        if (!formData.titre.trim()) {
          errors.titre = 'Le titre de la formation est requis';
        }
        break;
      
      case 'domaine':
        if (!formData.domaine_id) {
          errors.domaine_id = 'Veuillez sélectionner un domaine';
        }
        if (!formData.diplome) {
          errors.diplome = 'Veuillez sélectionner un diplôme';
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error('Veuillez corriger les erreurs avant de continuer');
      return;
    }

    // Marquer l'étape comme complétée
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // Passer à l'étape suivante
    if (currentIndex < FORM_STEPS.length - 1) {
      const nextStep = FORM_STEPS[currentIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevStep = FORM_STEPS[currentIndex - 1];
      setCurrentStep(prevStep.id);
    }
  };

  const handleChange = (field: string, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si on change le domaine, réinitialiser la mention
    if (field === 'domaine_id') {
      setFormData(prev => ({
        ...prev,
        mention_id: '',
      }));
    }
    
    // Effacer l'erreur du champ modifié
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    setIsSubmitting(true);
    try {
      // Créer l'objet à envoyer
      const formationData: any = {
        titre: formData.titre.trim(),
        type_formation: 'PRINCIPALE',
        description: formData.description.trim() || null,
        domaine_id: formData.domaine_id || null,
        mention_id: formData.mention_id || null,
        diplome: formData.diplome || null,
        duree_formation: formData.duree_formation.trim() || null,
        frais_scolarite: formData.frais_scolarite.trim() || null,
        objectifs: formData.objectifs || null,
        programme: formData.programme || null,
        specialite: formData.specialite.trim() || null,
        profile_sortie: formData.profile_sortie || null,
        condition_admission: formData.condition_admission || null,
        profile_intree: formData.profile_intree || null,
        evaluation: formData.evaluation || null,
        statut_formation: 'ACTIVE',
      };

      // Ajouter le fichier PDF si présent
      if (formData.programme_pdf) {
        const formDataToSend = new FormData();
        Object.entries(formationData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            formDataToSend.append(key, String(value));
          }
        });
        formDataToSend.append('programme_pdf', formData.programme_pdf);
        await formationService.create(formDataToSend as any);
      } else {
        await formationService.create(formationData);
      }

      // Revalider toutes les clés SWR liées aux formations (maintenant que la
      // nouvelle formation existe bien). Les clés SWRInfinite sont des
      // tableaux (['formations-infinite', filtres]), pas des chaînes.
      await mutate(
        (key) => {
          const firstSegment = Array.isArray(key) ? key[0] : key;
          return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
        },
        undefined,
        { revalidate: true }
      );

      toast.success('Formation principale créée avec succès');
      router.push('/dashboard/formations');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case 'informations':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la formation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                placeholder="Ex: Licence en Développement Web..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent ${
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Décrivez brièvement la formation..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.description.length}/500 caractères
              </p>
            </div>
          </div>
        );

      case 'domaine':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domaine <span className="text-red-500">*</span>
                </label>
                <SelectWithSearch
                  options={domaines.map(d => ({ value: d.id, label: d.nom }))}
                  value={formData.domaine_id}
                  onChange={(value) => handleChange('domaine_id', value)}
                  placeholder="Sélectionnez un domaine"
                  error={formErrors.domaine_id}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mention (optionnelle)
                </label>
                <SelectWithSearch
                  options={[
                    { value: '', label: 'Sans mention' },
                    ...filteredMentions.map(m => ({ value: m.id, label: m.titre }))
                  ]}
                  value={formData.mention_id}
                  onChange={(value) => handleChange('mention_id', value)}
                  placeholder="Sélectionnez une mention"
                  disabled={!formData.domaine_id}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diplôme délivré <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'LICENCE_PROFESSIONNELLE', label: 'Licence Professionnelle', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { value: 'LICENCE_FONDAMENTALE', label: 'Licence Fondamentale', color: 'bg-green-50 border-green-200 text-green-700' },
                  { value: 'MASTER', label: 'Master', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                ].map((diplome) => (
                  <button
                    key={diplome.value}
                    type="button"
                    onClick={() => handleChange('diplome', diplome.value)}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.diplome === diplome.value
                        ? `${diplome.color} border-opacity-100 font-semibold scale-105`
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {diplome.label}
                  </button>
                ))}
              </div>
              {formErrors.diplome && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.diplome}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée de la formation
                </label>
                <input
                  type="text"
                  value={formData.duree_formation}
                  onChange={(e) => handleChange('duree_formation', e.target.value)}
                  placeholder="Ex: 3 ans, 6 semestres..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frais de scolarité (approximatifs)
                </label>
                <input
                  type="text"
                  value={formData.frais_scolarite}
                  onChange={(e) => handleChange('frais_scolarite', e.target.value)}
                  placeholder="Ex: 15 000 FCFA par an..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'pedagogie':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectifs de la formation
              </label>
              <RichTextEditor
                key="objectifs-editor"
                value={formData.objectifs}
                onChange={(value: string) => handleChange('objectifs', value)}
                placeholder="Décrivez les objectifs d'apprentissage..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme général
              </label>
              <RichTextEditor
                key="programme-editor"
                value={formData.programme}
                onChange={(value: string) => handleChange('programme', value)}
                placeholder="Décrivez le contenu des modules..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité (optionnelle)
              </label>
              <input
                type="text"
                value={formData.specialite}
                onChange={(e) => handleChange('specialite', e.target.value)}
                placeholder="Ex: Développement Web, Data Science..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 'admission':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditions d'admission
              </label>
              <RichTextEditor
                key="condition-admission-editor"
                value={formData.condition_admission}
                onChange={(value: string) => handleChange('condition_admission', value)}
                placeholder="Prérequis académiques, procédures de sélection..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profil d'entrée attendu
              </label>
              <RichTextEditor
                key="profile-intree-editor"
                value={formData.profile_intree}
                onChange={(value: string) => handleChange('profile_intree', value)}
                placeholder="Décrivez le profil idéal des candidats..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profil de sortie
              </label>
              <RichTextEditor
                key="profile-sortie-editor"
                value={formData.profile_sortie}
                onChange={(value: string) => handleChange('profile_sortie', value)}
                placeholder="Compétences acquises, débouchés professionnels..."
              />
            </div>
          </div>
        );

      case 'programme':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalités d'évaluation
              </label>
              <RichTextEditor
                key="evaluation-editor"
                value={formData.evaluation}
                onChange={(value: string) => handleChange('evaluation', value)}
                placeholder="Examens, projets, stages, mémoire..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme PDF (optionnel)
              </label>
              <FileUpload
                onFileUpload={(file) => handleChange('programme_pdf', file)}
                label="Télécharger le programme détaillé"
                accept=".pdf"
                maxSize={15 * 1024 * 1024}
              />
              <p className="text-sm text-gray-500 mt-3">
                Vous pourrez créer des offres de formation (avec chef de parcours, dates précises) après avoir créé la formation.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
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
          <div className="p-3 bg-isdb-green-800 rounded-xl">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Créer une formation principale</h1>
            <p className="text-gray-600 mt-1">
              Remplissez les informations étape par étape
            </p>
          </div>
        </div>
      </div>

      <MultiStepForm
        steps={FORM_STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
      >
        {(stepId) => renderStepContent(stepId)}
      </MultiStepForm>

      {/* Boutons de navigation */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {isLastStep ? (
                <CheckCircle className="text-blue-600" size={20} />
              ) : (
                <div className="text-blue-600 font-medium">{currentIndex + 1}</div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isLastStep ? 'Finaliser la création' : FORM_STEPS[currentIndex].title}
              </p>
              <p className="text-sm text-gray-500">
                {isLastStep 
                  ? 'Vérifiez toutes les informations avant de soumettre'
                  : FORM_STEPS[currentIndex].description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Étape précédente
              </button>
            )}
            
            <button
              type="button"
              onClick={isLastStep ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                isLastStep
                  ? 'bg-isdb-green-800 to-slate-800 text-white hover:opacity-90'
                  : 'bg-isdb-green-700 text-white hover:opacity-90'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLastStep ? 'Création...' : 'Validation...'}
                </>
              ) : isLastStep ? (
                <>
                  <Save size={20} />
                  Créer la formation
                </>
              ) : (
                <>
                  <ChevronRight size={20} />
                  Étape suivante
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Aide */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-3">
          💡 Important : Chef de parcours et offres de formation
        </h3>
        <p className="text-blue-800 mb-4">
          Le chef de parcours sera défini lors de la création d'une offre de formation.
          Après avoir créé cette formation, vous pourrez :
        </p>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
            <span>Créer une ou plusieurs offres (pour différentes années académiques)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
            <span>Définir un chef de parcours pour chaque offre</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
            <span>Spécifier les dates précises, places disponibles, etc.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}