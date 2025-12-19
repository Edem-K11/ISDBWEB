'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  BookOpen,
  Building,
  Download,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFormationsInfinite } from '@/lib/hooks/useFormation';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { useMentions } from '@/lib/hooks/useMention';
import { formationService } from '@/lib/api/services/formationService';
import { mutate as globalMutate } from 'swr';
import ConfirmModal from '@/components/ui/confirmModal';
import { Badge } from '@/components/ui/badge';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { cn } from '@/lib/utils/cn';
import type { FormationFilters } from '@/lib/types/Formation';

export default function FormationsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FormationFilters>({
    search: '',
    type: '',
    domaine_id: '',
    mention_id: '',
    diplome: '',
    statut: 'ACTIVE',
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFormation, setExpandedFormation] = useState<number | null>(null);

  const { formations, isLoading, isLoadingMore, isReachingEnd, setSize, mutate } = useFormationsInfinite(filters);
  const { domaine: domaines } = useDomaines();
  const { mentions } = useMentions();

  // Filtrer les mentions par domaine sélectionné
  const filteredMentions = filters.domaine_id
    ? mentions.filter(m => m.domaine_id === filters.domaine_id)
    : mentions;

  const handleDelete = async () => {
    if (!formationToDelete) return;

    try {
      await formationService.delete(formationToDelete);
      toast.success('Formation archivée avec succès');
      
      // Revalider les données
      await mutate();
      await globalMutate('formations');
      
      setDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setFormationToDelete(null);
    }
  };

  const handleFilterChange = (field: keyof FormationFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Si on change le domaine, réinitialiser la mention
      if (field === 'domaine_id') {
        newFilters.mention_id = '';
      }
      
      return newFilters;
    });
  };

  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size => size + 1);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      domaine_id: '',
      mention_id: '',
      diplome: '',
      statut: 'ACTIVE',
    });
  };

  const getDiplomeColor = (diplome?: string) => {
    switch (diplome) {
      case 'LICENCE_PROFESSIONNELLE':
        return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200';
      case 'LICENCE_FONDAMENTALE':
        return 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200';
      case 'MASTER':
        return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200';
      case 'CERTIFICAT_MODULE':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200';
    }
  };

    const formatDiplome = (diplome?: string) => {
    if (!diplome) return '';
    return diplome.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formations</h1>
          <p className="text-gray-600 mt-1">
            Gérez les formations principales et modulaires de l'institut
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors",
              showFilters
                ? "border-isdb-green-500 bg-isdb-green-50 text-isdb-green-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter size={18} />
            Filtres
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <Link
            href="/dashboard/formations/create"
            className="px-4 py-2 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle formation
          </Link>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Nom, description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="PRINCIPALE">Principale</option>
                <option value="MODULAIRE">Modulaire</option>
              </select>
            </div>

            {/* Domaine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine
              </label>
              <SelectWithSearch
                options={[
                  { value: '', label: 'Tous les domaines' },
                  ...domaines.map(d => ({ value: d.id, label: d.nom }))
                ]}
                value={filters.domaine_id}
                onChange={(value) => handleFilterChange('domaine_id', value)}
                placeholder="Sélectionnez un domaine"
              />
            </div>

            {/* Mention */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mention
              </label>
              <SelectWithSearch
                options={[
                  { value: '', label: 'Toutes les mentions' },
                  ...filteredMentions.map(m => ({ value: m.id, label: m.titre }))
                ]}
                value={filters.mention_id}
                onChange={(value) => handleFilterChange('mention_id', value)}
                placeholder="Sélectionnez une mention"
                disabled={!filters.domaine_id}
              />
            </div>

            {/* Diplôme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diplôme
              </label>
              <select
                value={filters.diplome}
                onChange={(e) => handleFilterChange('diplome', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              >
                <option value="">Tous les diplômes</option>
                <option value="LICENCE_PROFESSIONNELLE">Licence Professionnelle</option>
                <option value="LICENCE_FONDAMENTALE">Licence Fondamentale</option>
                <option value="MASTER">Master</option>
                <option value="CERTIFICAT_MODULE">Certificat Module</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-isdb-green-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVEE">Archivée</option>
              </select>
            </div>

            {/* Boutons d'action */}
            <div className="md:col-span-2 lg:col-span-2 flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={16} />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des formations */}
      <div className="space-y-4">
        {isLoading ? (
          // Squelette de chargement
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))
        ) : formations.length > 0 ? (
          <>
            {formations.map((formation) => (
              <div
                key={formation.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* En-tête de la formation */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn(
                        "p-3 rounded-lg shrink-0",
                        formation.type_formation === 'PRINCIPALE'
                          ? 'bg-blue-50'
                          : 'bg-green-50'
                      )}>
                        {formation.type_formation === 'PRINCIPALE' ? (
                          <GraduationCap className="h-6 w-6 text-blue-600" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formation.titre}
                          </h3>
                          <Badge variant={
                            formation.type_formation === 'PRINCIPALE' ? 'info' : 'success'
                          }>
                            {formation.type_formation === 'PRINCIPALE' ? 'Principale' : 'Modulaire'}
                          </Badge>
                          
                          {formation.diplome && (
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              getDiplomeColor(formation.diplome)
                            )}>
                              {formatDiplome(formation.diplome)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500 mb-3">
                          {formation.domaine && (
                            <div className="flex items-center gap-1">
                              <Building size={14} />
                              <span>{formation.domaine.nom}</span>
                            </div>
                          )}
                          
                          {formation.mention && (
                            <div className="flex items-center gap-1">
                              <BookOpen size={14} />
                              <span>{formation.mention.titre}</span>
                            </div>
                          )}
                          
                          {formation.duree_formation && (
                            <div className="flex items-center gap-1">
                              <span>⏱️ {formation.duree_formation}</span>
                            </div>
                          )}
                        </div>
                        
                        {formation.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {formation.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">
                          {formation.offresFormations?.length || 0} offre(s)
                        </Badge>
                        <Badge variant={
                          formation.statut_formation === 'ACTIVE' ? 'success' : 'warning'
                        } size="sm">
                          {formation.statut_formation === 'ACTIVE' ? 'Active' : 'Archivée'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.push(`/dashboard/formations/${formation.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/formations/${formation.id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setFormationToDelete(formation.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Archiver"
                        >
                          <Archive size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton pour voir plus */}
                  <button
                    onClick={() => setExpandedFormation(
                      expandedFormation === formation.id ? null : formation.id
                    )}
                    className="mt-4 text-sm text-isdb-green-600 hover:text-isdb-green-700 flex items-center gap-1 font-medium"
                  >
                    {expandedFormation === formation.id ? (
                      <>
                        <ChevronUp size={16} />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Voir plus d'informations
                      </>
                    )}
                  </button>
                </div>
                
                {/* Section étendue */}
                {expandedFormation === formation.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Objectifs</h4>
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {formation.objectifs ? (
                            <div dangerouslySetInnerHTML={{ __html: formation.objectifs }} />
                          ) : (
                            <p className="text-gray-400 italic">Non spécifié</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Profil de sortie</h4>
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {formation.profile_sortie ? (
                            <div dangerouslySetInnerHTML={{ __html: formation.profile_sortie }} />
                          ) : (
                            <p className="text-gray-400 italic">Non spécifié</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                        <div className="space-y-2">
                          <Link
                            href={`/dashboard/formations/${formation.id}/offres`}
                            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center transition-colors"
                          >
                            Gérer les offres
                          </Link>
                          {formation.programme_pdf && (
                            <a
                              href={formation.programme_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center flex items-center justify-center gap-2 transition-colors"
                            >
                              <Download size={16} />
                              Télécharger le programme
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Bouton "Voir plus" pour la pagination infinie */}
            {!isReachingEnd && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto transition-colors"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                      Chargement...
                    </>
                  ) : (
                    'Charger plus de formations'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          // État vide
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="text-gray-400" size={40} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune formation trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search || Object.values(filters).some(v => v !== '' && v !== 'ACTIVE')
                ? 'Aucun résultat pour votre recherche. Essayez de modifier vos filtres.' 
                : 'Commencez par créer votre première formation.'}
            </p>
            {!filters.search && Object.values(filters).every(v => v === '' || v === 'ACTIVE') && (
              <Link
                href="/dashboard/formations/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-isdb-green-500 text-white rounded-lg hover:bg-isdb-green-600 transition-colors"
              >
                <Plus size={20} />
                Créer une formation
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setFormationToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Archiver la formation"
        message="Êtes-vous sûr de vouloir archiver cette formation ? Elle ne sera plus visible pour les visiteurs mais restera accessible en consultation."
        confirmText="Archiver"
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
      />
    </div>
  );
}