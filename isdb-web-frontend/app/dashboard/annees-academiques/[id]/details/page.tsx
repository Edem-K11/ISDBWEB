

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Star,
  TrendingUp,
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAnneeAcademique } from '@/lib/hooks/useAnneeAcademique';
import { anneeAcademiqueService } from '@/lib/api/services/anneeAcademiqueService';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/confirmModal';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function AnneeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { annee, isLoading, mutate } = useAnneeAcademique(id);
  const [statistics, setStatistics] = useState<any>(null);
  const [offres, setOffres] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingOffres, setIsLoadingOffres] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadStatistics();
      loadOffres();
    }
  }, [id]);

  const loadStatistics = async () => {
    try {
      const stats = await anneeAcademiqueService.getStatistics(id);
      setStatistics(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadOffres = async () => {
    try {
      const offresData = await anneeAcademiqueService.getOffres(id);
      setOffres(offresData);
    } catch (error) {
      console.error('Erreur lors du chargement des offres', error);
    } finally {
      setIsLoadingOffres(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await anneeAcademiqueService.delete(id);
      toast.success('Année académique supprimée avec succès');
      router.push(ENDPOINTS.DASHBOARD_ANNEES_ACADEMIQUES);
      mutate();
      router.refresh();
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

  if (!annee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Année académique non trouvée</p>
          <Link
            href="/dashboard/annees-academiques"
            className="text-isdb-green-600 hover:underline"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/annees-academiques"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux années académiques
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              annee.est_actuelle ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {annee.libelle}
                </h1>
                {annee.est_actuelle && (
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={annee.est_actuelle ? 'success' : 'default'}>
                  {annee.est_actuelle ? 'En cours' : 'Inactive'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {annee.annee_debut} - {annee.annee_fin}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_EDIT(id))}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit size={18} />
            </button>
            
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={annee.est_actuelle}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={annee.est_actuelle ? 'Impossible de supprimer l\'année actuelle' : 'Supprimer'}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations générales
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Année de début</p>
                  <p className="text-xl font-bold text-gray-900">{annee.annee_debut}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Année de fin</p>
                  <p className="text-xl font-bold text-gray-900">{annee.annee_fin}</p>
                </div>
              </div>

              {annee.date_debut && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date de début</p>
                  <p className="font-medium text-gray-900">
                    {new Date(annee.date_debut).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {annee.date_fin && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date de fin</p>
                  <p className="font-medium text-gray-900">
                    {new Date(annee.date_fin).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {annee.date_debut && annee.date_fin && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Durée totale</p>
                  <p className="font-medium text-gray-900">
                    {Math.ceil(
                      (new Date(annee.date_fin).getTime() - new Date(annee.date_debut).getTime()) 
                      / (1000 * 60 * 60 * 24)
                    )} jours
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          {isLoadingStats ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            </div>
          ) : statistics ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Statistiques
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Total offres</p>
                  <p className="text-2xl font-bold text-blue-900">{statistics.nombre_offres || 0}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Dispensées</p>
                  <p className="text-2xl font-bold text-green-900">{statistics.offres_dispensees || 0}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Principales</p>
                  <p className="text-2xl font-bold text-purple-900">{statistics.formations_principales || 0}</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-600 mb-1">Modulaires</p>
                  <p className="text-2xl font-bold text-orange-900">{statistics.formations_modulaires || 0}</p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-600 mb-1">Places totales</p>
                  <p className="text-2xl font-bold text-indigo-900">{statistics.places_totales || 0}</p>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-pink-600 mb-1">Avec places limitées</p>
                  <p className="text-2xl font-bold text-pink-900">{statistics.offres_avec_places_limitees || 0}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Liste des offres */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Offres de formation ({offres.length})
              </h2>
              <Link
                href={`/dashboard/offres-formations?annee_academique_id=${id}`}
                className="text-sm text-isdb-green-600 hover:underline"
              >
                Voir toutes les offres
              </Link>
            </div>

            {isLoadingOffres ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : offres.length > 0 ? (
              <div className="space-y-3">
                {offres.slice(0, 5).map((offre) => (
                  <div
                    key={offre.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-isdb-green-300 transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/offres-formations/${offre.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {offre.formation?.titre}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {offre.chef_parcours && (
                            <span>Chef: {offre.chef_parcours}</span>
                          )}
                          {offre.animateur && (
                            <span>Animateur: {offre.animateur}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {offre.est_dispensee ? (
                          <CheckCircle className="text-green-500" size={18} />
                        ) : (
                          <XCircle className="text-gray-400" size={18} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {offres.length > 5 && (
                  <button
                    onClick={() => router.push(`/dashboard/offres-formations?annee_academique_id=${id}`)}
                    className="w-full py-2 text-sm text-isdb-green-600 hover:bg-isdb-green-50 rounded-lg transition-colors"
                  >
                    Voir {offres.length - 5} offre(s) de plus
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Aucune offre de formation pour cette année</p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Statut */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Statut
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Année actuelle</span>
                {annee.est_actuelle ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-gradient-to-br from-isdb-green-50 to-green-50 rounded-xl border border-isdb-green-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Actions rapides
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => router.push(ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_EDIT(id))}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Modifier l'année
              </button>
              
              <Link
                href={`/dashboard/offres-formations?annee_academique_id=${id}`}
                className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center"
              >
                Voir les offres
              </Link>

              <Link
                href={ENDPOINTS.DASHBOARD_RECONDUIRE_OFFRES}
                className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium text-center"
              >
                Reconduire les offres
              </Link>
            </div>
          </div>

          {/* Informations système */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Informations système
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Créée le</p>
                <p className="text-gray-900">
                  {annee.created_at ? new Date(annee.created_at).toLocaleDateString('fr-FR') : ('--')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Dernière modification</p>
                <p className="text-gray-900">
                  {annee.updated_at ? new Date(annee.updated_at).toLocaleDateString('fr-FR') : ('--')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'année académique"
        message="Êtes-vous sûr de vouloir supprimer cette année académique ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}