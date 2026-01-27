

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  BarChart3,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAnneesAcademiques } from '@/lib/hooks/useAnneeAcademique';
import { anneeAcademiqueService } from '@/lib/api/services/anneeAcademiqueService';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/confirmModal';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function AnneesAcademiquesPage() {
  const router = useRouter();
  const { annees, isLoading, mutate } = useAnneesAcademiques();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [anneeToDelete, setAnneeToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Filtrer les années
  const filteredAnnees = annees.filter(annee => {
    if (!searchTerm) return true;
    return (
      annee.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annee.annee_debut.toString().includes(searchTerm) ||
      annee.annee_fin.toString().includes(searchTerm)
    );
  });

  // Limiter l'affichage à 5 si showAll est false
  const displayedAnnees = showAll ? filteredAnnees : filteredAnnees.slice(0, 5);
  const hasMore = filteredAnnees.length > 5;

  const handleDelete = async () => {
    if (!anneeToDelete) return;

    setIsDeleting(true);
    try {
      await anneeAcademiqueService.delete(anneeToDelete);
      toast.success('Année académique supprimée avec succès');
      mutate();
      setDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setAnneeToDelete(null);
    }
  };

    const getStatutAnnee = (annee: any) => {
    const now = new Date();
    const dateDebut = annee.date_debut ? new Date(annee.date_debut) : null;
    const dateFin = annee.date_fin ? new Date(annee.date_fin) : null;
    
    // Année actuelle basée sur le flag
    if (annee.est_actuelle) {
      return { 
        label: 'En cours', 
        color: 'success',
        icon: 'CheckCircle'
      };
    }
    
    // Année future
    if (dateDebut && now < dateDebut) {
      return { 
        label: 'À venir', 
        color: 'info',
        icon: 'Calendar'
      };
    }
    
    // Année terminée
    if (dateFin && now > dateFin) {
      return { 
        label: 'Terminée', 
        color: 'default',
        icon: 'CheckCircle'
      };
    }
    
    // Cas par défaut (ne devrait pas arriver)
    return { 
      label: 'Indéterminé', 
      color: 'warning',
      icon: 'AlertCircle'
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Années Académiques</h1>
          <p className="text-gray-600 mt-1">
            Gérez les années académiques de l'institut
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={ENDPOINTS.DASHBOARD_RECONDUIRE_OFFRES}
            className="px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Reconduire les offres
          </Link>
          
          <Link
            href={ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_NEW}
            className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle année
          </Link>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total</p>
            <Calendar className="text-gray-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{annees.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">En cours</p>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {annees.filter(a => a.est_actuelle).length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">À venir</p>
            <Calendar className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {annees.filter(a => {
              const now = new Date();
              const dateDebut = a.date_debut ? new Date(a.date_debut) : null;
              return dateDebut ? now < dateDebut : false;
            }).length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Terminées</p>
            <XCircle className="text-gray-400" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-600">
            {annees.filter(a => {
              const now = new Date();
              const dateFin = a.date_fin ? new Date(a.date_fin) : null;
              return dateFin ? now > dateFin && !a.est_actuelle : false;
            }).length}
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une année académique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des années */}
      {filteredAnnees.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {displayedAnnees.map((annee) => {
              const statut = getStatutAnnee(annee);
              const estTerminee = statut.label === 'Terminée';
              
              return (
                <div
                  key={annee.id}
                  className={`rounded-xl border-2 transition-all hover:shadow-md ${
                    annee.est_actuelle 
                      ? 'bg-green-50/70 border-green-700/50' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${
                            annee.est_actuelle ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <Calendar className={
                              annee.est_actuelle ? 'text-green-600' : 'text-gray-600'
                            } size={20} />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900">
                                {annee.libelle}
                              </h3>
                              {annee.est_actuelle && (
                                <Star className="text-yellow-500 fill-yellow-500" size={18} />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={statut.color as any}>
                                {statut.label}
                              </Badge>
                              {annee.nombre_offres !== undefined && (
                                <span className="text-sm text-gray-500">
                                  {annee.nombre_offres} offre(s)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Période académique</p>
                            <p className="font-medium text-gray-900">
                              {annee.annee_debut} - {annee.annee_fin}
                            </p>
                          </div>

                          {annee.date_debut && (
                            <div>
                              <p className="text-gray-500 mb-1">Date de début</p>
                              <p className="font-medium text-gray-900">
                                {new Date(annee.date_debut).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          )}

                          {annee.date_fin && (
                            <div>
                              <p className="text-gray-500 mb-1">Date de fin</p>
                              <p className="font-medium text-gray-900">
                                {new Date(annee.date_fin).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_DETAILS(annee.id))}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => router.push(`/dashboard/annees-academiques/${annee.id}/statistiques`)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Statistiques"
                        >
                          <BarChart3 size={18} />
                        </button>
                        
                        <button
                          onClick={() => router.push(ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_EDIT(annee.id))}
                          disabled={estTerminee}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={estTerminee ? 'Impossible de modifier une année terminée' : 'Modifier'}
                        >
                          <Edit size={18} />
                        </button>
                        
                        <button
                          onClick={() => {
                            setAnneeToDelete(annee.id);
                            setDeleteModalOpen(true);
                          }}
                          disabled={estTerminee}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={estTerminee ? 'Impossible de supprimer une année terminée' : 'Supprimer'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bouton Afficher plus / Afficher moins */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-isdb-green-500 transition-all font-medium flex items-center gap-2"
              >
                {showAll ? (
                  <>
                    Afficher moins
                    <ChevronDown size={18} className="rotate-180 transition-transform" />
                  </>
                ) : (
                  <>
                    Afficher plus ({filteredAnnees.length - 5} année(s) supplémentaire(s))
                    <ChevronDown size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-gray-400" size={40} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune année académique trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Aucun résultat pour votre recherche.' 
              : 'Commencez par créer votre première année académique.'}
          </p>
          {!searchTerm && (
            <Link
              href={ENDPOINTS.DASHBOARD_ANNEE_ACADEMIQUE_NEW}
              className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
            >
              <Plus size={20} />
              Créer une année académique
            </Link>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAnneeToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer l'année académique"
        message="Êtes-vous sûr de vouloir supprimer cette année académique ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}