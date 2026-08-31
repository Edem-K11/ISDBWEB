'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Archive,
  Trash2,
  RotateCcw,
  Building,
  BookOpen,
  GraduationCap,
  Clock,
  Wallet,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFormation } from '@/lib/hooks/useFormation';
import { formationService } from '@/lib/api/services/formationService';
import { StatutFormation } from '@/lib/types/Formation';
import { ENDPOINTS } from '@/lib/api/endpoints';
import ConfirmModal from '@/components/ui/confirmModal';
import { mutate as globalMutate } from 'swr';

// Les clés SWRInfinite (ex: useFormationsInfinite) sont des tableaux
// (['formations-infinite', filtres]), pas des chaînes.
const revalidateFormationsCaches = () =>
  globalMutate(
    (key) => {
      const firstSegment = Array.isArray(key) ? key[0] : key;
      return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
    },
    undefined,
    { revalidate: true }
  );

const DIPLOME_LABELS: Record<string, string> = {
  LICENCE_PROFESSIONNELLE: 'Licence Professionnelle',
  LICENCE_FONDAMENTALE: 'Licence Fondamentale',
  MASTER: 'Master',
  CERTIFICAT_MODULE: 'Certificat Module',
};

// Un bloc de contenu riche (objectifs, programme, ...) provenant de l'éditeur
// du dashboard — vrai HTML, à parser plutôt qu'à afficher tel quel.
function RichSection({ title, html }: Readonly<{ title: string; html?: string | null }>) {
  if (!html) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="prose prose-sm max-w-none text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

export default function FormationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { formation, isLoading, isError, mutate: mutateFormation } = useFormation(id);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  // Une formation déjà archivée propose "Supprimer" à la place d'"Archiver"
  // sur toutes les pages qui la concernent (liste, détails, édition).
  const isArchived = formation?.statut_formation === StatutFormation.ARCHIVEE;

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (isArchived) {
        await formationService.delete(id);
        toast.success('Formation supprimée avec succès');
      } else {
        await formationService.archive(id);
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
      await formationService.activate(id);
      toast.success('Formation réactivée avec succès');
      await mutateFormation();
      await revalidateFormationsCaches();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réactivation');
    } finally {
      setIsReactivating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-isdb-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isError || !formation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Formation introuvable</p>
          <Link href={ENDPOINTS.DASHBOARD_FORMATIONS} className="text-isdb-green-600 hover:underline">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const isPrincipale = formation.type_formation === 'PRINCIPALE';
  const diplomeLabel = formation.diplome ? DIPLOME_LABELS[formation.diplome] || formation.diplome : null;
  const editHref = ENDPOINTS.DASHBOARD_FORMATION_PRINCIPALE_EDIT(id);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={ENDPOINTS.DASHBOARD_FORMATIONS}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux formations
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${isPrincipale ? 'bg-blue-600' : 'bg-isdb-green-600'}`}>
              {isPrincipale ? (
                <GraduationCap className="text-white" size={24} />
              ) : (
                <BookOpen className="text-white" size={24} />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{formation.titre}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isPrincipale ? 'bg-blue-50 text-blue-700' : 'bg-isdb-green-50 text-isdb-green-700'
                }`}>
                  {isPrincipale ? 'Formation Principale' : 'Formation Modulaire'}
                </span>
                {diplomeLabel && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600">
                    {diplomeLabel}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formation.statut_formation === StatutFormation.ACTIVE
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {formation.statut_formation === StatutFormation.ACTIVE ? 'Active' : 'Archivée'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(editHref)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit size={18} />
            </button>
            {isArchived ? (
              <>
                <button
                  onClick={handleReactivate}
                  disabled={isReactivating}
                  className="p-2 text-isdb-green-600 hover:bg-isdb-green-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Réactiver"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => setActionModalOpen(true)}
                  disabled={isProcessing}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setActionModalOpen(true)}
                disabled={isProcessing}
                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                title="Archiver"
              >
                <Archive size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>

            <div className="space-y-4">
              {formation.domaine && (
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Domaine</p>
                    <p className="font-medium text-gray-900">{formation.domaine.nom}</p>
                  </div>
                </div>
              )}

              {formation.mention && (
                <div className="flex items-start gap-3">
                  <BookOpen className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Mention</p>
                    <p className="font-medium text-gray-900">{formation.mention.titre}</p>
                  </div>
                </div>
              )}

              {formation.duree_formation && (
                <div className="flex items-start gap-3">
                  <Clock className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-medium text-gray-900">{formation.duree_formation}</p>
                  </div>
                </div>
              )}

              {formation.frais_scolarite && (
                <div className="flex items-start gap-3">
                  <Wallet className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Frais de scolarité</p>
                    <p className="font-medium text-gray-900">{formation.frais_scolarite}</p>
                  </div>
                </div>
              )}

              {formation.specialite && (
                <div className="flex items-start gap-3">
                  <Layers className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Spécialité</p>
                    <p className="font-medium text-gray-900">{formation.specialite}</p>
                  </div>
                </div>
              )}

              {formation.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-line">{formation.description}</p>
                </div>
              )}

              {!formation.domaine && !formation.mention && !formation.duree_formation &&
                !formation.frais_scolarite && !formation.specialite && !formation.description && (
                <p className="text-sm text-gray-500">Aucune information complémentaire renseignée.</p>
              )}
            </div>
          </div>

          <RichSection title="Objectifs de la formation" html={formation.objectifs} />
          <RichSection title="Profil d'entrée" html={formation.profile_intree} />
          <RichSection title="Conditions d'admission" html={formation.condition_admission} />

          {formation.programme && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Programme de la formation</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: formation.programme }} />
              </div>
              {formation.programme_pdf && (
                <a
                  href={formation.programme_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-isdb-green-50 text-isdb-green-700 rounded-lg hover:bg-isdb-green-100 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Télécharger le programme (PDF)
                </a>
              )}
            </div>
          )}

          <RichSection title="Modalités d'évaluation" html={formation.evaluation} />
          <RichSection title="Débouchés et poursuites d'études" html={formation.profile_sortie} />
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Offres associées */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Offres associées</h3>
            <p className="text-2xl font-bold text-isdb-green-600 mb-3">
              {formation.offresFormations?.length || 0}
            </p>
            <Link
              href={ENDPOINTS.DASHBOARD_FORMATION_OFFRES(id)}
              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center text-sm font-medium text-gray-700 transition-colors"
            >
              Gérer les offres
            </Link>
          </div>

          {/* Programme PDF */}
          {formation.programme_pdf && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Document</h3>
              <a
                href={formation.programme_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-red-100 rounded-lg shrink-0">
                  <FileText className="text-red-600" size={18} />
                </div>
                <span className="text-sm font-medium text-gray-700">Programme (PDF)</span>
                <Download className="ml-auto text-gray-400" size={16} />
              </a>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-gradient-to-br from-isdb-green-50 to-emerald-50 rounded-xl border border-isdb-green-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(editHref)}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Modifier la formation
              </button>
              {isArchived && (
                <button
                  onClick={handleReactivate}
                  disabled={isReactivating}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Réactiver la formation
                </button>
              )}
              <button
                onClick={() => setActionModalOpen(true)}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isArchived ? 'Supprimer la formation' : 'Archiver la formation'}
              </button>
            </div>
          </div>
        </div>
      </div>

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
