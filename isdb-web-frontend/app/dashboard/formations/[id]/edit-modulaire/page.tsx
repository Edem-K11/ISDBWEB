'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, BookOpen, AlertCircle, Clock, DollarSign, Loader2, Archive, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import { useFormationModulaire } from '@/lib/hooks/useFormationModulaire';
import { StatutFormation } from '@/lib/types/Formation';
import { ENDPOINTS } from '@/lib/api/endpoints';
import RichTextEditor from '@/components/dashboard/blogs/richTextEditor';
import ConfirmModal from '@/components/ui/confirmModal';
import { mutate } from 'swr';

export default function EditFormationModulairePage() {
  const router = useRouter();
  const params = useParams();
  const formationId = Number(params.id);

  const { formation, isLoading: isLoadingFormation, mutate: mutateFormation } = useFormationModulaire(formationId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  // Reflète le statut réellement enregistré (pas la bascule en cours de
  // modification dans le formulaire) : une fois la formation archivée, ce
  // bouton devient "Supprimer" sur toutes les pages qui la concernent.
  const isArchived = formation?.statut_formation === StatutFormation.ARCHIVEE;

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    contenu: '',
    duree_heures: '',
    frais_inscription: '',
    frais_formation: '',
    statut_formation: StatutFormation.ACTIVE as StatutFormation.ACTIVE | StatutFormation.ARCHIVEE,
  });

  useEffect(() => {
    if (formation) {
      setFormData({
        titre: formation.titre || '',
        description: formation.description || '',
        contenu: formation.contenu || '',
        duree_heures: formation.duree_heures != null ? String(formation.duree_heures) : '',
        frais_inscription: formation.frais_inscription != null ? String(formation.frais_inscription) : '',
        frais_formation: formation.frais_formation != null ? String(formation.frais_formation) : '',
        statut_formation: formation.statut_formation === StatutFormation.ARCHIVEE ? StatutFormation.ARCHIVEE : StatutFormation.ACTIVE,
      });
    }
  }, [formation]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      errors.titre = 'Le titre de la formation est requis';
    }

    if (formData.duree_heures && Number.isNaN(Number(formData.duree_heures))) {
      errors.duree_heures = 'La durée doit être un nombre d\'heures';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
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
      await formationModulaireService.update(formationId, {
        titre: formData.titre.trim(),
        description: formData.description.trim() || undefined,
        contenu: formData.contenu.trim() || undefined,
        duree_heures: formData.duree_heures ? Number(formData.duree_heures) : undefined,
        frais_inscription: formData.frais_inscription ? Number(formData.frais_inscription) : undefined,
        frais_formation: formData.frais_formation ? Number(formData.frais_formation) : undefined,
        statut_formation: formData.statut_formation,
      });

      await mutateFormation();
      await mutate(
        key => Array.isArray(key) && key[0] === 'formations-modulaires-dashboard',
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

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (isArchived) {
        await formationModulaireService.delete(formationId);
        toast.success('Formation modulaire supprimée avec succès');
      } else {
        await formationModulaireService.archive(formationId);
        toast.success('Formation modulaire archivée avec succès');
      }
      // Les clés SWR concernées sont soit des tableaux
      // (['formations-modulaires-dashboard', filtres]), soit des chaînes
      // (`formation-modulaire-${id}`) — on couvre les deux formes.
      await mutate(
        (key) => {
          const firstSegment = Array.isArray(key) ? key[0] : key;
          return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
        },
        undefined,
        { revalidate: true }
      );
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
      await formationModulaireService.activate(formationId);
      toast.success('Formation modulaire réactivée avec succès');
      await mutateFormation();
      await mutate(
        (key) => {
          const firstSegment = Array.isArray(key) ? key[0] : key;
          return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
        },
        undefined,
        { revalidate: true }
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réactivation');
    } finally {
      setIsReactivating(false);
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-isdb-green-600 rounded-xl">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier la formation modulaire</h1>
              <p className="text-gray-600 mt-1">
                Modifiez les informations de l'atelier/formation courte
              </p>
            </div>
          </div>

          {isArchived ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReactivate}
                disabled={isReactivating}
                className="inline-flex items-center gap-2 px-4 py-2 text-isdb-green-700 bg-isdb-green-50 hover:bg-isdb-green-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                title="Réactiver"
              >
                <RotateCcw size={16} />
                Réactiver
              </button>
              <button
                type="button"
                onClick={() => setActionModalOpen(true)}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                title="Supprimer"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
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

      {/* Formulaire */}
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
              placeholder="Ex: Animation Radio / TV..."
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent resize-none"
              maxLength={300}
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.description.length}/300 caractères
            </p>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu de la formation
            </label>
            <RichTextEditor
              value={formData.contenu}
              onChange={(value) => handleChange('contenu', value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (heures)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Clock className="text-gray-400" size={18} />
                </div>
                <input
                  type="number"
                  min={1}
                  value={formData.duree_heures}
                  onChange={(e) => handleChange('duree_heures', e.target.value)}
                  placeholder="Ex: 144"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent ${
                    formErrors.duree_heures ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {formErrors.duree_heures && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {formErrors.duree_heures}
                </p>
              )}
            </div>

            {/* Frais d'inscription */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais d'inscription
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="text-gray-400" size={18} />
                </div>
                <input
                  type="number"
                  min={0}
                  value={formData.frais_inscription}
                  onChange={(e) => handleChange('frais_inscription', e.target.value)}
                  placeholder="Ex: 10000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Frais de formation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de formation
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="text-gray-400" size={18} />
                </div>
                <input
                  type="number"
                  min={0}
                  value={formData.frais_formation}
                  onChange={(e) => handleChange('frais_formation', e.target.value)}
                  placeholder="Ex: 50000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">Formation active</p>
              <p className="text-sm text-gray-500">
                Visible par les visiteurs du site tant qu'elle est active.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formData.statut_formation === StatutFormation.ACTIVE}
              onClick={() => setFormData(prev => ({
                ...prev,
                statut_formation: prev.statut_formation === StatutFormation.ACTIVE
                  ? StatutFormation.ARCHIVEE
                  : StatutFormation.ACTIVE,
              }))}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                formData.statut_formation === StatutFormation.ACTIVE ? 'bg-isdb-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.statut_formation === StatutFormation.ACTIVE ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
              className="px-6 py-3 bg-isdb-green-600 text-white rounded-lg hover:bg-isdb-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2 min-w-[180px]"
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
        <div className="bg-isdb-green-50 border border-isdb-green-200 rounded-xl p-6">
          <h3 className="font-medium text-isdb-green-900 mb-3 flex items-center gap-2">
            <BookOpen size={20} />
            À propos des formations modulaires
          </h3>
          <ul className="text-isdb-green-800 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-isdb-green-500 rounded-full mt-2 shrink-0" />
              <span>Ateliers pratiques, séminaires, ou formations courtes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-isdb-green-500 rounded-full mt-2 shrink-0" />
              <span>Indépendantes des domaines et mentions</span>
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
            {formation.created_at && (
              <div className="flex justify-between">
                <span>Créée le :</span>
                <span>{new Date(formation.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {formation.updated_at && (
              <div className="flex justify-between">
                <span>Dernière modification :</span>
                <span>{new Date(formation.updated_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={isArchived ? 'Supprimer la formation modulaire' : 'Archiver la formation modulaire'}
        message={
          isArchived
            ? 'Êtes-vous sûr de vouloir supprimer définitivement cette formation modulaire ? Elle ne sera plus accessible nulle part, y compris dans le dashboard.'
            : 'Êtes-vous sûr de vouloir archiver cette formation modulaire ? Elle ne sera plus visible pour les visiteurs mais restera accessible en consultation.'
        }
        confirmText={isArchived ? 'Supprimer' : 'Archiver'}
        confirmButtonClass={isArchived ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
      />
    </div>
  );
}
