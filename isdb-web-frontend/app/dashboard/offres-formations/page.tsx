

'use client';

import { useState } from 'react';
import { Plus, Search, Calendar, Filter, Edit, Eye, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useOffresFormations } from '@/lib/hooks/useOffreFormation';
import { useAnneesAcademiques } from '@/lib/hooks/useAnneeAcademique';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { Badge } from '@/components/ui/badge';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function OffresFormationsPage() {
  const router = useRouter();
  const { annees } = useAnneesAcademiques();
  
  // Trouver l'année actuelle par défaut
  const anneeActuelleId = annees.find(a => a.est_actuelle)?.id;
  
  type FiltersState = {
    search: string;
    annee_academique_id: number | "" | undefined;
    type_formation: '' | 'PRINCIPALE' | 'MODULAIRE';
    dispensees_only: boolean;
  };
  
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    annee_academique_id: anneeActuelleId ?? '',
    type_formation: '' as '' | 'PRINCIPALE' | 'MODULAIRE',
    dispensees_only: false,
  });

  const { offres, isLoading, mutate } = useOffresFormations(filters);

  const handleToggleDispensee = async (offreId: number) => {
    try {
      await offreFormationService.toggleDispensee(offreId);
      toast.success('Statut modifié avec succès');
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const searchLower = filters.search.toLowerCase();
  
  const filteredOffres = offres.filter(offre => {
    if (filters.search) {
      return (
        offre.formation?.titre?.toLowerCase().includes(searchLower) ||
        offre.chef_parcours?.toLowerCase().includes(searchLower) ||
        offre.animateur?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const anneeSelectionnee = annees.find(a => a.id === filters.annee_academique_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offres de Formation</h1>
          <p className="text-gray-600 mt-1">
            {anneeSelectionnee ? (
              <>
                Année académique : <span className="font-medium">{anneeSelectionnee.libelle}</span>
                {anneeSelectionnee.est_actuelle && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    En cours
                  </span>
                )}
              </>
            ) : (
              'Gérez les offres de formation'
            )}
          </p>
        </div>
        
        <button
          onClick={() => router.push(ENDPOINTS.DASHBOARD_OFFRE_FORMATION_NEW)}
          className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle offre
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Rechercher une formation, chef de parcours..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500"
              />
            </div>
          </div>

          {/* Année Académique */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année académique
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={filters.annee_academique_id}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  annee_academique_id: e.target.value ? Number(e.target.value) : ''
                }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 appearance-none"
              >
                <option value="">Toutes les années</option>
                {annees.map(annee => (
                  <option key={annee.id} value={annee.id}>
                    {annee.libelle} {annee.est_actuelle ? '(En cours)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type de formation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type_formation}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                type_formation: e.target.value as '' | 'PRINCIPALE' | 'MODULAIRE'
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500"
            >
              <option value="">Tous les types</option>
              <option value="PRINCIPALE">Principale</option>
              <option value="MODULAIRE">Modulaire</option>
            </select>
          </div>
        </div>

        {/* Checkbox dispensées */}
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.dispensees_only}
              onChange={(e) => setFilters(prev => ({ ...prev, dispensees_only: e.target.checked }))}
              className="w-4 h-4 text-isdb-green-600 border-gray-300 rounded focus:ring-isdb-green-500"
            />
            <span className="text-sm text-gray-700">Afficher uniquement les offres dispensées</span>
          </label>
        </div>
      </div>

      {/* Liste des offres */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-isdb-green-500" />
        </div>
      ) : filteredOffres.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredOffres.map((offre) => (
            <div key={offre.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offre.formation?.titre}
                    </h3>
                    <Badge variant={offre.formation?.type_formation === 'PRINCIPALE' ? 'info' : 'success'}>
                      {offre.formation?.type_formation === 'PRINCIPALE' ? 'Principale' : 'Modulaire'}
                    </Badge>
                    <Badge variant={offre.est_dispensee ? 'success' : 'warning'}>
                      {offre.est_dispensee ? 'Dispensée' : 'Non dispensée'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                    {offre.chef_parcours && (
                      <div>
                        <span className="text-gray-500">Chef de parcours:</span>
                        <p className="font-medium text-gray-900">{offre.chef_parcours}</p>
                      </div>
                    )}
                    {offre.animateur && (
                      <div>
                        <span className="text-gray-500">Animateur:</span>
                        <p className="font-medium text-gray-900">{offre.animateur}</p>
                      </div>
                    )}
                    {offre.date_debut && (
                      <div>
                        <span className="text-gray-500">Période:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(offre.date_debut).toLocaleDateString('fr-FR')}
                          {offre.date_fin && ` - ${new Date(offre.date_fin).toLocaleDateString('fr-FR')}`}
                        </p>
                      </div>
                    )}
                    {offre.place_limited && (
                      <div>
                        <span className="text-gray-500">Places:</span>
                        <p className="font-medium text-gray-900">{offre.place_limited} places</p>
                      </div>
                    )}
                    {offre.prix && (
                      <div>
                        <span className="text-gray-500">Prix:</span>
                        <p className="font-medium text-gray-900">{offre.prix}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleDispensee(offre.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      offre.est_dispensee
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={offre.est_dispensee ? 'Désactiver' : 'Activer'}
                  >
                    {offre.est_dispensee ? <Power size={18} /> : <PowerOff size={18} />}
                  </button>
                  <button
                    onClick={() => router.push(ENDPOINTS.DASHBOARD_OFFRE_FORMATION_DETAILS(offre.id))}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir détails"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => router.push(ENDPOINTS.DASHBOARD_OFFRE_FORMATION_EDIT(offre.id))}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune offre trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.type_formation
              ? 'Aucun résultat pour votre recherche'
              : `Aucune offre pour ${anneeSelectionnee?.libelle || 'cette année'}`}
          </p>
        </div>
      )}
    </div>
  );
}