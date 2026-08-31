'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Power,
  PowerOff,
  User,
  UserCog,
  Users,
  Banknote,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFormation } from '@/lib/hooks/useFormation';
import { useOffresFormations } from '@/lib/hooks/useOffreFormation';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { Badge } from '@/components/ui/badge';
import { ActionsMenu } from '@/components/ui/actionsMenu';
import ConfirmModal from '@/components/ui/confirmModal';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function FormationOffresPage() {
  const router = useRouter();
  const params = useParams();
  const formationId = Number(params.id);

  const { formation, isLoading: isLoadingFormation, isError: isFormationError } = useFormation(formationId);
  const { offres, isLoading: isLoadingOffres, mutate } = useOffresFormations({ formation_id: formationId });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offreToDelete, setOffreToDelete] = useState<number | null>(null);

  const handleToggleDispensee = async (offreId: number) => {
    try {
      await offreFormationService.toggleDispensee(offreId);
      toast.success('Statut modifié avec succès');
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const handleDelete = async () => {
    if (!offreToDelete) return;

    try {
      await offreFormationService.delete(offreToDelete);
      toast.success('Offre supprimée avec succès');
      mutate();
      setDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setOffreToDelete(null);
    }
  };

  if (isLoadingFormation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-isdb-green-600 animate-spin" />
      </div>
    );
  }

  if (isFormationError || !formation) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={ENDPOINTS.DASHBOARD_FORMATION_DETAILS(formationId)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour à la formation
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offres de formation</h1>
            <p className="text-gray-600 mt-1">{formation.titre}</p>
          </div>

          <button
            onClick={() => router.push(`${ENDPOINTS.DASHBOARD_OFFRE_FORMATION_NEW}?formation_id=${formationId}`)}
            className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle offre
          </button>
        </div>
      </div>

      {/* Liste des offres */}
      {isLoadingOffres ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500" />
        </div>
      ) : offres.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {offres.map((offre) => (
            <div key={offre.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">
                    {offre.annee_academique?.libelle}
                  </h3>
                  {offre.annee_academique?.est_actuelle && (
                    <Badge variant="info">En cours</Badge>
                  )}
                  <Badge variant={offre.est_dispensee ? 'success' : 'warning'}>
                    {offre.est_dispensee ? 'Dispensée' : 'Non dispensée'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => router.push(ENDPOINTS.DASHBOARD_OFFRE_FORMATION_DETAILS(offre.id))}
                    className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Voir
                  </button>
                  <ActionsMenu
                    items={[
                      {
                        label: 'Modifier',
                        icon: <Edit size={16} />,
                        onClick: () => router.push(ENDPOINTS.DASHBOARD_OFFRE_FORMATION_EDIT(offre.id)),
                      },
                      {
                        label: offre.est_dispensee ? 'Désactiver' : 'Activer',
                        icon: offre.est_dispensee ? <PowerOff size={16} /> : <Power size={16} />,
                        onClick: () => handleToggleDispensee(offre.id),
                      },
                      {
                        label: 'Supprimer',
                        icon: <Trash2 size={16} />,
                        variant: 'danger',
                        onClick: () => {
                          setOffreToDelete(offre.id);
                          setDeleteModalOpen(true);
                        },
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                {offre.chef_parcours && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                      <User size={14} />
                      Chef de parcours
                    </span>
                    <p className="mt-2 text-sm font-bold text-gray-900">{offre.chef_parcours}</p>
                  </div>
                )}
                {offre.animateur && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                      <UserCog size={14} />
                      Animateur
                    </span>
                    <p className="mt-2 text-sm font-bold text-gray-900">{offre.animateur}</p>
                  </div>
                )}
                {offre.date_debut && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                      <Calendar size={14} />
                      Période
                    </span>
                    <p className="mt-2 text-sm font-bold text-gray-900">
                      {new Date(offre.date_debut).toLocaleDateString('fr-FR')}
                      {offre.date_fin && ` - ${new Date(offre.date_fin).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                )}
                {offre.place_limited && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                      <Users size={14} />
                      Places
                    </span>
                    <p className="mt-2 text-sm font-bold text-gray-900">{offre.place_limited} places</p>
                  </div>
                )}
                {offre.prix && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                      <Banknote size={14} />
                      Prix
                    </span>
                    <p className="mt-2 text-sm font-bold text-gray-900">{offre.prix}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre pour cette formation</h3>
          <p className="text-gray-500 mb-6">Créez une première offre pour la rendre dispensée sur une année académique.</p>
          <button
            onClick={() => router.push(`${ENDPOINTS.DASHBOARD_OFFRE_FORMATION_NEW}?formation_id=${formationId}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
          >
            <Plus size={20} />
            Nouvelle offre
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setOffreToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer l'offre"
        message="Êtes-vous sûr de vouloir supprimer cette offre de formation ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
