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
  Clock,
  Wallet,
  Loader2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFormationModulaire } from '@/lib/hooks/useFormationModulaire';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import { StatutFormation } from '@/lib/types/Formation';
import { ENDPOINTS } from '@/lib/api/endpoints';
import ConfirmModal from '@/components/ui/confirmModal';
import { mutate as globalMutate } from 'swr';

// Les clés SWR concernées sont soit des tableaux (['formations-modulaires-dashboard', filtres]),
// soit des chaînes (`formation-modulaire-${id}`) — on couvre les deux formes.
const revalidateFormationsCaches = () =>
  globalMutate(
    (key) => {
      const firstSegment = Array.isArray(key) ? key[0] : key;
      return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
    },
    undefined,
    { revalidate: true }
  );

function formatFcfa(value?: number | null) {
  if (value === null || value === undefined) return null;
  return `${value.toLocaleString('fr-FR')} FCFA`;
}

export default function FormationModulaireDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { formation, isLoading, isError, mutate: mutateFormation } = useFormationModulaire(id);
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
        await formationModulaireService.delete(id);
        toast.success('Formation modulaire supprimée avec succès');
      } else {
        await formationModulaireService.archive(id);
        toast.success('Formation modulaire archivée avec succès');
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
      await formationModulaireService.activate(id);
      toast.success('Formation modulaire réactivée avec succès');
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
          <p className="text-gray-900 font-medium mb-2">Formation modulaire introuvable</p>
          <Link href={ENDPOINTS.DASHBOARD_FORMATIONS} className="text-isdb-green-600 hover:underline">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const editHref = ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_EDIT(id);

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
            <div className="p-3 rounded-xl bg-isdb-green-600">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{formation.titre}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-isdb-green-50 text-isdb-green-700">
                  Formation Modulaire
                </span>
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
              {formation.duree_heures != null && (
                <div className="flex items-start gap-3">
                  <Clock className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-medium text-gray-900">{formation.duree_heures} heures</p>
                  </div>
                </div>
              )}

              {formation.frais_inscription != null && (
                <div className="flex items-start gap-3">
                  <Wallet className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Frais d'inscription</p>
                    <p className="font-medium text-gray-900">{formatFcfa(formation.frais_inscription)}</p>
                  </div>
                </div>
              )}

              {formation.frais_formation != null && (
                <div className="flex items-start gap-3">
                  <Wallet className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Frais de formation</p>
                    <p className="font-medium text-gray-900">{formatFcfa(formation.frais_formation)}</p>
                  </div>
                </div>
              )}

              {formation.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-line">{formation.description}</p>
                </div>
              )}

              {formation.duree_heures == null && formation.frais_inscription == null &&
                formation.frais_formation == null && !formation.description && (
                <p className="text-sm text-gray-500">Aucune information complémentaire renseignée.</p>
              )}
            </div>
          </div>

          {/* Contenu du module : édité via un éditeur riche (comme les articles de blog) */}
          {formation.contenu && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenu du module</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: formation.contenu }} />
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
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
