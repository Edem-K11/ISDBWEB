

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  GraduationCap,
  BookOpen,
  Target,
  Users,
  FileText,
  AlertCircle,
  Building,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
  Download,
  Archive,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formationService } from '@/lib/api/services/formationService';
import { useFormation } from '@/lib/hooks/useFormation';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { useMentions } from '@/lib/hooks/useMention';
import RichTextEditor from '@/components/ui/richTextEditor';
import { FileUpload } from '@/components/ui/fileUpload';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import ConfirmModal from '@/components/ui/confirmModal';
import { StatutFormation } from '@/lib/types/Formation';
import { mutate } from 'swr';
import { cn } from '@/lib/utils/cn';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function EditFormationPrincipalePage() {
  const router = useRouter();
  const params = useParams();
  const formationId = Number(params.id);
  
  const { formation, isLoading: isLoadingFormation, mutate: mutateFormation } = useFormation(formationId);
  const { domaine: domaines } = useDomaines();
  const { mentions } = useMentions();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  // Reflète le statut réellement enregistré : une fois la formation archivée,
  // ce bouton devient "Supprimer" (avec "Réactiver" en plus) à la place
  // d'"Archiver", sur toutes les pages qui la concernent.
  const isArchived = formation?.statut_formation === StatutFormation.ARCHIVEE;

  const revalidateFormationsCaches = () =>
    mutate(
      (key) => {
        const firstSegment = Array.isArray(key) ? key[0] : key;
        return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
      },
      undefined,
      { revalidate: true }
    );

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (isArchived) {
        await formationService.delete(formationId);
        toast.success('Formation supprimée avec succès');
      } else {
        await formationService.archive(formationId);
        toast.success('Formation archivée avec succès');
      }
      await revalidateFormationsCaches();
      router.push(ENDPOINTS.DASHBOARD_FORMATIONS);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          (isArchived ? 'Erreur lors de la suppression' : "Erreur lors de l'archivage")
      );
    } finally {
      setIsProcessing(false);
      setActionModalOpen(false);
    }
  };

  // Réactivation : action non destructive, pas besoin de confirmation.
  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await formationService.activate(formationId);
      toast.success('Formation réactivée avec succès');
      await mutateFormation();
      await revalidateFormationsCaches();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réactivation');
    } finally {
      setIsReactivating(false);
    }
  };

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'informations',
    'domaine',
    'pedagogie',
    'admission',
    'programme'
  ]);

  // Form data
  const [formData, setFormData] = useState({
    // Informations générales
    titre: '',
    description: '',
    
    // Domaine et diplôme
    domaine_id: '' as number | '',
    mention_id: '' as number | '',
    diplome: '' as '' | 'LICENCE_PROFESSIONNELLE' | 'LICENCE_FONDAMENTALE' | 'MASTER',
    duree_formation: '',
    frais_scolarite: '',
    
    // Pédagogie
    objectifs: '',
    programme: '',
    specialite: '',
    profile_sortie: '',
    
    // Admission
    condition_admission: '',
    profile_intree: '',
    evaluation: '',
    
    // Programme
    programme_pdf: null as File | null,
    existing_programme_pdf: '',
  });

  // Filtre des mentions par domaine sélectionné
  const filteredMentions = formData.domaine_id
    ? mentions.filter(m => m.domaine_id === formData.domaine_id)
    : [];

  // Charger les données de la formation
  useEffect(() => {
    if (formation) {
      // Vérifier si c'est bien une formation principale
      if (formation.type_formation !== 'PRINCIPALE') {
        toast.error('Cette formation n\'est pas une formation principale');
        router.push('/dashboard/formations');
        return;
      }

      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        titre: formation.titre || '',
        description: formation.description || '',
        
        domaine_id: formation.domaine?.id || '',
        mention_id: formation.mention?.id || '',
        diplome: (formation.diplome && ['LICENCE_PROFESSIONNELLE', 'LICENCE_FONDAMENTALE', 'MASTER'].includes(formation.diplome) ? formation.diplome : '') as '' | 'LICENCE_PROFESSIONNELLE' | 'LICENCE_FONDAMENTALE' | 'MASTER',
        duree_formation: formation.duree_formation || '',
        frais_scolarite: formation.frais_scolarite || '',
        
        objectifs: formation.objectifs || '',
        programme: formation.programme || '',
        specialite: formation.specialite || '',
        profile_sortie: formation.profile_sortie || '',
        
        condition_admission: formation.condition_admission || '',
        profile_intree: formation.profile_intree || '',
        evaluation: formation.evaluation || '',
        
        programme_pdf: null,
        existing_programme_pdf: formation.programme_pdf || '',
      });
    }
  }, [formation, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      errors.titre = 'Le titre de la formation est requis';
    }
    
    if (!formData.domaine_id) {
      errors.domaine_id = 'Veuillez sélectionner un domaine';
    }
    
    if (!formData.diplome) {
      errors.diplome = 'Veuillez sélectionner un diplôme';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      // Développer les sections avec erreurs
      const sectionsWithErrors = Object.keys(formErrors).map(error => {
        if (error.includes('titre') || error.includes('description')) return 'informations';
        if (error.includes('domaine') || error.includes('diplome')) return 'domaine';
        return null;
      }).filter(Boolean) as string[];
      
      setExpandedSections(prev => [...new Set([...prev, ...sectionsWithErrors])]);
      return;
    }

    setIsSubmitting(true);
    try {
      // Créer l'objet à envoyer
      const formationData: any = {
        titre: formData.titre.trim(),
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
      };

      // Le fichier PDF (s'il y en a un) est ajouté à l'objet simple : c'est
      // formationService.update qui se charge de construire le FormData et de
      // passer par un POST + _method=PUT (seule combinaison que PHP sait
      // parser pour un upload de fichier — un vrai PUT multipart n'est jamais
      // lu côté serveur).
      await formationService.update(formationId, {
        ...formationData,
        ...(formData.programme_pdf ? { programme_pdf: formData.programme_pdf } : {}),
      });

      // Revalider les données. Les clés SWRInfinite sont des tableaux
      // (['formations-infinite', filtres]), pas des chaînes.
      await mutateFormation();
      await mutate(
        (key) => {
          const firstSegment = Array.isArray(key) ? key[0] : key;
          return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
        },
        undefined,
        { revalidate: true }
      );

      toast.success('Formation principale mise à jour avec succès');
      router.push(ENDPOINTS.DASHBOARD_FORMATIONS);
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
      <div className="max-w-4xl mx-auto py-12">
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
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Formation non trouvée</h2>
          <p className="text-gray-600 mb-6">
            La formation que vous essayez de modifier n'existe pas ou a été supprimée.
          </p>
          <Link
            href={ENDPOINTS.DASHBOARD_FORMATIONS}
            className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  const renderSection = (sectionId: string, title: string, icon: React.ReactNode, content: React.ReactNode) => {
    const isExpanded = expandedSections.includes(sectionId);
    
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => toggleSection(sectionId)}
          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-isdb-green-100 rounded-lg">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isExpanded && (
          <div className="p-6 bg-white">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/formations"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux formations
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-isdb-green-800 rounded-xl">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier la formation principale</h1>
              <p className="text-gray-600 mt-1">
                Mettez à jour les informations de la formation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-2 py-1 rounded text-sm",
              formation.statut_formation === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            )}>
              {formation.statut_formation === 'ACTIVE' ? 'Active' : 'Archivée'}
            </span>

            {isArchived ? (
              <>
                <button
                  type="button"
                  onClick={handleReactivate}
                  disabled={isReactivating}
                  className="inline-flex items-center gap-2 px-4 py-2 text-isdb-green-700 bg-isdb-green-50 hover:bg-isdb-green-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 shrink-0"
                  title="Réactiver"
                >
                  <RotateCcw size={16} />
                  Réactiver
                </button>
                <button
                  type="button"
                  onClick={() => setActionModalOpen(true)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 shrink-0"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setActionModalOpen(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 shrink-0"
                title="Archiver"
              >
                <Archive size={16} />
                Archiver
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informations générales */}
        {renderSection(
          'informations',
          'Informations générales',
          <BookOpen className="h-5 w-5 text-isdb-green-600" />,
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
        )}

        {/* Section 2: Domaine et diplôme */}
        {renderSection(
          'domaine',
          'Domaine et diplôme',
          <Building className="h-5 w-5 text-isdb-green-600" />,
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
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Clock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.duree_formation}
                    onChange={(e) => handleChange('duree_formation', e.target.value)}
                    placeholder="Ex: 3 ans, 6 semestres..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frais de scolarité (approximatifs)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <DollarSign className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.frais_scolarite}
                    onChange={(e) => handleChange('frais_scolarite', e.target.value)}
                    placeholder="Ex: 15 000 FCFA par an..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Pédagogie */}
        {renderSection(
          'pedagogie',
          'Pédagogie',
          <Target className="h-5 w-5 text-isdb-green-600" />,
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
        )}

        {/* Section 4: Admission */}
        {renderSection(
          'admission',
          'Admission',
          <Users className="h-5 w-5 text-isdb-green-600" />,
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
        )}

        {/* Section 5: Programme */}
        {renderSection(
          'programme',
          'Programme',
          <FileText className="h-5 w-5 text-isdb-green-600" />,
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
              <div className="space-y-4">
                {formData.existing_programme_pdf && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-red-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">Fichier actuel</p>
                          <p className="text-sm text-gray-500">
                            Programme PDF téléchargé précédemment
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={formData.existing_programme_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir le fichier"
                        >
                          <Eye size={18} />
                        </a>
                        <a
                          href={formData.existing_programme_pdf}
                          download
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    {formData.existing_programme_pdf 
                      ? 'Pour remplacer le fichier existant, téléchargez un nouveau fichier PDF :' 
                      : 'Télécharger un fichier PDF du programme détaillé :'}
                  </p>
                  <FileUpload
                    onFileUpload={(file) => handleChange('programme_pdf', file)}
                    existingFileUrl={formData.existing_programme_pdf}
                    label="Télécharger un nouveau programme PDF"
                    accept=".pdf"
                    maxSize={15 * 1024 * 1024}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-600">
              <p className="text-sm">
                Tous les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires.
              </p>
              <p className="text-sm mt-1">
                Les modifications seront immédiatement appliquées.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
                className="px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Mettre à jour la formation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={isArchived ? 'Supprimer la formation' : 'Archiver la formation'}
        message={
          isArchived
            ? 'Êtes-vous sûr de vouloir supprimer définitivement cette formation ? Elle ne sera plus accessible nulle part, y compris dans le dashboard.'
            : 'Êtes-vous sûr de vouloir archiver cette formation ? Elle ne sera plus visible pour les visiteurs mais restera accessible en consultation.'
        }
        confirmText={isArchived ? 'Supprimer' : 'Archiver'}
        confirmButtonClass={isArchived ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
      />
    </div>
  );
}