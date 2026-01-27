

'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  DollarSign,
  BookOpen,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Power,
  PowerOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useOffreFormation } from '@/lib/hooks/useOffreFormation';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/confirmModal';

export default function OffreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const { offre, isLoading, mutate } = useOffreFormation(id);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingDispensee, setIsTogglingDispensee] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await offreFormationService.delete(id);
      toast.success('Offre supprimée avec succès');
      router.push('/dashboard/offres-formations');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleDispensee = async () => {
    setIsTogglingDispensee(true);
    try {
      await offreFormationService.toggleDispensee(id);
      toast.success('Statut modifié avec succès');
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setIsTogglingDispensee(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement...</p>
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

  const isFormationPrincipale = offre.formation?.type_formation === 'PRINCIPALE';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/offres-formations"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux offres
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              isFormationPrincipale ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {isFormationPrincipale ? (
                <GraduationCap className="text-white" size={24} />
              ) : (
                <BookOpen className="text-white" size={24} />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {offre.formation?.titre}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={isFormationPrincipale ? 'info' : 'success'}>
                  {isFormationPrincipale ? 'Formation Principale' : 'Formation Modulaire'}
                </Badge>
                <Badge variant={offre.est_dispensee ? 'success' : 'warning'}>
                  {offre.est_dispensee ? 'Dispensée' : 'Non dispensée'}
                </Badge>
                {offre.est_en_cours && (
                  <Badge variant="default">
                    En cours
                  </Badge>
                )}
                {offre.est_future && (
                  <Badge variant="info">
                    À venir
                  </Badge>
                )}
                {offre.est_passee && (
                  <Badge>
                    Terminée
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDispensee}
              disabled={isTogglingDispensee}
              className={`p-2 rounded-lg transition-colors ${
                offre.est_dispensee
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400 hover:bg-gray-50'
              } disabled:opacity-50`}
              title={offre.est_dispensee ? 'Désactiver' : 'Activer'}
            >
              {isTogglingDispensee ? (
                <Loader2 size={18} className="animate-spin" />
              ) : offre.est_dispensee ? (
                <Power size={18} />
              ) : (
                <PowerOff size={18} />
              )}
            </button>
            <button
              onClick={() => router.push(`/dashboard/offres-formations/${id}/edit`)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          {/* Informations de la formation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations de la formation
            </h2>
            
            <div className="space-y-4">
              {offre.formation?.domaine && (
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Domaine</p>
                    <p className="font-medium text-gray-900">{offre.formation.domaine.nom}</p>
                  </div>
                </div>
              )}

              {offre.formation?.mention && (
                <div className="flex items-start gap-3">
                  <BookOpen className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Mention</p>
                    <p className="font-medium text-gray-900">{offre.formation.mention.titre}</p>
                  </div>
                </div>
              )}

              {offre.formation?.diplome && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Diplôme</p>
                    <p className="font-medium text-gray-900">
                      {offre.formation.diplome.replace(/_/g, ' ').toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </p>
                  </div>
                </div>
              )}

              {offre.formation?.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">{offre.formation.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Responsables */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Responsables
            </h2>
            
            <div className="space-y-4">
              {offre.chef_parcours && (
                <div className="flex items-start gap-3">
                  <Users className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Chef de parcours</p>
                    <p className="font-medium text-gray-900">{offre.chef_parcours}</p>
                  </div>
                </div>
              )}

              {offre.animateur && (
                <div className="flex items-start gap-3">
                  <Users className="text-gray-400 mt-1 shrink-0" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Animateur</p>
                    <p className="font-medium text-gray-900">{offre.animateur}</p>
                  </div>
                </div>
              )}

              {!offre.chef_parcours && !offre.animateur && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Aucun responsable défini
                </div>
              )}
            </div>
          </div>

          {/* Dates et période */}
          {(offre.date_debut || offre.date_fin) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Dates et période
              </h2>
              
              <div className="space-y-4">
                {offre.date_debut && (
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-400 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Date de début</p>
                      <p className="font-medium text-gray-900">
                        {new Date(offre.date_debut).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {offre.date_fin && (
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-400 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Date de fin</p>
                      <p className="font-medium text-gray-900">
                        {new Date(offre.date_fin).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {offre.date_debut && offre.date_fin && (
                  <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                    <Clock className="text-gray-400 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Durée</p>
                      <p className="font-medium text-gray-900">
                        {Math.ceil(
                          (new Date(offre.date_fin).getTime() - new Date(offre.date_debut).getTime()) 
                          / (1000 * 60 * 60 * 24)
                        )} jours
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Année académique */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Année académique
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-indigo-600">
                  {offre.annee_academique?.libelle}
                </p>
                {offre.annee_academique?.est_actuelle && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full mt-2">
                    <CheckCircle size={12} />
                    Année en cours
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Détails pratiques */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Détails pratiques
            </h3>
            
            <div className="space-y-4">
              {offre.place_limited !== null && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Places disponibles</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{offre.place_limited}</p>
                    {offre.a_places_disponibles ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )}
                  </div>
                </div>
              )}

              {offre.prix && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Frais</p>
                  <p className="text-2xl font-bold text-gray-900">{offre.prix}</p>
                </div>
              )}

              {!offre.place_limited && !offre.prix && (
                <p className="text-sm text-gray-500">Aucune information disponible</p>
              )}
            </div>
          </div>

          {/* Statut */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Statut
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dispensée</span>
                {offre.est_dispensee ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">En cours</span>
                {offre.est_en_cours ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-gray-400" size={20} />
                )}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Actions rapides
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/offres-formations/${id}/edit`)}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Modifier l'offre
              </button>
              
              <button
                onClick={handleToggleDispensee}
                disabled={isTogglingDispensee}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {offre.est_dispensee ? 'Désactiver' : 'Activer'} l'offre
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {/* <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'offre"
        message="Êtes-vous sûr de vouloir supprimer cette offre de formation ? Cette action est irréversible."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
      /> */}
    </div>
  );
}