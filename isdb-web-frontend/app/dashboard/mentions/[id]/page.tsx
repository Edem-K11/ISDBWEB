'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  Building,
  GraduationCap,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMention } from '@/lib/hooks/useMention';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { mentionService } from '@/lib/api/services/mentionService';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/confirmModal';
import { ENDPOINTS } from '@/lib/api/endpoints';
import apiClient from '@/lib/api/axios';
import type { Formation } from '@/lib/types/Formation';

export default function MentionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { mention, isLoading, isError } = useMention(id);
  const { mutate: mutateDomaines } = useDomaines();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: formations, isLoading: isLoadingFormations } = useSWR<Formation[]>(
    id ? `Mentions/${id}/Formations` : null,
    async () => {
      const { data } = await apiClient.get(ENDPOINTS.DASHBOARD_MENTION_FORMATIONS(id));
      return data.data;
    },
    { revalidateOnFocus: false }
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await mentionService.delete(id);
      toast.success('Mention supprimée avec succès');
      await mutateDomaines();
      router.push(ENDPOINTS.DASHBOARD_MENTIONS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
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

  if (isError || !mention) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Mention introuvable</p>
          <Link href={ENDPOINTS.DASHBOARD_MENTIONS} className="text-isdb-green-600 hover:underline">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  const editHref = ENDPOINTS.DASHBOARD_MENTION_EDIT(id);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={ENDPOINTS.DASHBOARD_MENTIONS}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux mentions
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-isdb-green-50">
              <BookOpen className="text-isdb-green-700" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{mention.titre}</h1>
              <Badge variant="info" size="sm">
                {mention.domaine?.nom || 'Sans domaine'}
              </Badge>
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
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
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
              {mention.domaine && (
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Domaine</p>
                    <p className="font-medium text-gray-900">{mention.domaine.nom}</p>
                  </div>
                </div>
              )}

              {mention.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-line">{mention.description}</p>
                </div>
              )}

              {!mention.description && !mention.domaine && (
                <p className="text-sm text-gray-500">Aucune information complémentaire renseignée.</p>
              )}
            </div>
          </div>

          {/* Formations associées */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Formations associées</h2>

            {isLoadingFormations ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 text-isdb-green-600 animate-spin" />
              </div>
            ) : formations && formations.length > 0 ? (
              <div className="space-y-2">
                {formations.map((formation) => (
                  <Link
                    key={formation.id}
                    href={ENDPOINTS.DASHBOARD_FORMATION_DETAILS(formation.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                      <GraduationCap className="text-blue-600" size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{formation.titre}</p>
                      {formation.diplome && (
                        <p className="text-xs text-gray-500">{formation.diplome.replace(/_/g, ' ')}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Aucune formation active pour cette mention.</p>
            )}
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Formations</h3>
            <p className="text-2xl font-bold text-isdb-green-600">
              {mention.nombre_formations ?? formations?.length ?? 0}
            </p>
          </div>

          {/* Actions rapides */}
          <div className="bg-gradient-to-br from-isdb-green-50 to-emerald-50 rounded-xl border border-isdb-green-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(editHref)}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Modifier la mention
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                disabled={isDeleting}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Supprimer la mention
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la mention"
        message="Êtes-vous sûr de vouloir supprimer cette mention ? Cette action est irréversible et affectera les formations associées."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
