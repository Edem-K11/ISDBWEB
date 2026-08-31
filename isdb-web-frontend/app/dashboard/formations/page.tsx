'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Archive,
  Trash2,
  GraduationCap,
  BookOpen,
  Bookmark,
  Clock,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useFormationsInfinite } from '@/lib/hooks/useFormation';
import { useFormationModulaires } from '@/lib/hooks/useFormationModulaire';
import { useDomaines } from '@/lib/hooks/useDomaine';
import { useMentions } from '@/lib/hooks/useMention';
import { formationService } from '@/lib/api/services/formationService';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import { mutate as globalMutate } from 'swr';
import ConfirmModal from '@/components/ui/confirmModal';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { cn } from '@/lib/utils/cn';
import { ActionsMenu } from '@/components/ui/actionsMenu';
import { StatutFormation } from '@/lib/types/Formation';
import type { Formation, FormationFilters } from '@/lib/types/Formation';
import type { FormationModulaire } from '@/lib/types/FormationModulaire';
import { ENDPOINTS } from '@/lib/api/endpoints';

type FormationRow =
  | { kind: 'formation'; id: number; data: Formation }
  | { kind: 'modulaire'; id: number; data: FormationModulaire };

export default function FormationsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FormationFilters>({
    search: '',
    type: '',
    domaine_id: '',
    mention_id: '',
    diplome: '',
    statut: StatutFormation.ACTIVE,
  });
  const [archiveTarget, setArchiveTarget] = useState<{ id: number; kind: 'formation' | 'modulaire' } | null>(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; kind: 'formation' | 'modulaire' } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFormation, setExpandedFormation] = useState<number | null>(null);

  const { formations, isLoading, isLoadingMore, isReachingEnd, setSize, mutate } = useFormationsInfinite(filters);

  // Les formations modulaires vivent dans une table séparée (formation_modulaires),
  // indépendante des domaines/mentions. Elles correspondent au diplôme "Certificat Module".
  const modulairesApplicables = !filters.domaine_id && !filters.mention_id
    && (filters.diplome === '' || filters.diplome === 'CERTIFICAT_MODULE')
    && filters.type !== 'PRINCIPALE';
  const {
    formationsModulaires,
    isLoading: isLoadingModulaires,
    mutate: mutateModulaires,
  } = useFormationModulaires(
    { search: filters.search, statut: filters.statut },
    modulairesApplicables
  );

  const { domaine: domaines } = useDomaines();
  const { mentions } = useMentions();

  // ✅ Revalider les données à chaque montage du composant
  useEffect(() => {
    globalMutate(
      (key) => {
        // Les clés SWRInfinite (ex: useFormationsInfinite) sont des tableaux
        // (['formations-infinite', filtres]), pas des chaînes — l'ancien filtre
        // ne les détectait donc jamais et ne revalidait rien en pratique.
        const firstSegment = Array.isArray(key) ? key[0] : key;
        return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
      },
      undefined,
      { revalidate: true }
    );
  }, []); // Se déclenche uniquement au montage

  // ✅ Revalider systématiquement dès qu'un filtre change (pas seulement au
  // montage) : sans ça, revenir à une combinaison de filtres déjà visitée un
  // peu plus tôt dans la session pouvait réafficher un résultat mis en cache
  // avant que les données réelles n'aient changé (ex: avant un archivage).
  useEffect(() => {
    mutate();
    if (modulairesApplicables) {
      mutateModulaires();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Fusionne les formations (table `formations`) et les formations modulaires (table `formation_modulaires`)
  const rows: FormationRow[] = useMemo(() => {
    const formationRows: FormationRow[] = formations.map((f) => ({ kind: 'formation', id: f.id, data: f }));
    const modulaireRows: FormationRow[] = modulairesApplicables
      ? formationsModulaires.map((m) => ({ kind: 'modulaire', id: m.id, data: m }))
      : [];

    return [...modulaireRows, ...formationRows].sort((a, b) => a.data.titre.localeCompare(b.data.titre));
  }, [formations, formationsModulaires, modulairesApplicables]);

  // Filtrer les mentions par domaine sélectionné
  const filteredMentions = filters.domaine_id
    ? mentions.filter(m => m.domaine_id === filters.domaine_id)
    : mentions;

  // Revalide toutes les combinaisons de filtres en cache (pas seulement celle
  // affichée en ce moment) : sans ça, basculer sur "Archivée" juste après un
  // archivage pouvait afficher une liste obsolète encore en cache.
  const revalidateFormationsCaches = () =>
    globalMutate(
      (key) => {
        const firstSegment = Array.isArray(key) ? key[0] : key;
        return typeof firstSegment === 'string' && firstSegment.startsWith('formation');
      },
      undefined,
      { revalidate: true }
    );

  const handleArchive = async () => {
    if (!archiveTarget) return;

    try {
      if (archiveTarget.kind === 'modulaire') {
        await formationModulaireService.archive(archiveTarget.id);
        await mutateModulaires();
      } else {
        await formationService.archive(archiveTarget.id);
        await mutate();
      }
      await revalidateFormationsCaches();

      toast.success('Formation archivée avec succès');
      setArchiveModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erreur lors de l'archivage";
      toast.error(errorMessage);
    } finally {
      setArchiveTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.kind === 'modulaire') {
        await formationModulaireService.delete(deleteTarget.id);
        await mutateModulaires();
      } else {
        await formationService.delete(deleteTarget.id);
        await mutate();
      }
      await revalidateFormationsCaches();

      toast.success('Formation supprimée avec succès');
      setDeleteModalOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setDeleteTarget(null);
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
      statut: StatutFormation.ACTIVE,
    });
  };

  const formatDiplome = (diplome?: string | null) => {
    if (!diplome) return '';
    return diplome.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const loading = isLoading || (modulairesApplicables && isLoadingModulaires);

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
            type="submit"
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
                <option value={StatutFormation.ACTIVE}>Active</option>
                <option value={StatutFormation.ARCHIVEE}>Archivée</option>
              </select>
            </div>

            {/* Boutons d'action */}
            <div className="md:col-span-2 lg:col-span-2 flex items-end">
              <button
                type="button"
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
        {loading ? (
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
        ) : rows.length > 0 ? (
          <>
            {rows.map((row) => {
              const isModulaire = row.kind === 'modulaire';
              const titre = row.data.titre;
              const description = row.data.description;
              const statut = row.data.statut_formation;

              const isFormationModulaireType = !isModulaire && (row.data as Formation).type_formation === 'MODULAIRE';

              const editHref = isModulaire || isFormationModulaireType
                ? ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_EDIT(row.id)
                : ENDPOINTS.DASHBOARD_FORMATION_PRINCIPALE_EDIT(row.id);

              const viewHref = isModulaire || isFormationModulaireType
                ? ENDPOINTS.DASHBOARD_FORMATION_MODULAIRE_DETAILS(row.id)
                : ENDPOINTS.DASHBOARD_FORMATION_DETAILS(row.id);

              return (
                <div
                  key={`${row.kind}-${row.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* En-tête de la formation */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center",
                        !isModulaire && (row.data as Formation).type_formation === 'PRINCIPALE'
                          ? 'bg-blue-50'
                          : 'bg-isdb-green-50'
                      )}>
                        {!isModulaire && (row.data as Formation).type_formation === 'PRINCIPALE' ? (
                          <GraduationCap className="h-6 w-6 text-blue-600" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-isdb-green-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900">
                            {titre}
                          </h3>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            !isModulaire && (row.data as Formation).type_formation === 'PRINCIPALE'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-isdb-green-50 text-isdb-green-700'
                          )}>
                            {!isModulaire && (row.data as Formation).type_formation === 'PRINCIPALE' ? 'Principale' : 'Modulaire'}
                          </span>

                          {!isModulaire && (row.data as Formation).diplome && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600">
                              {formatDiplome((row.data as Formation).diplome)}
                            </span>
                          )}

                          {isModulaire && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600">
                              Certificat Module
                            </span>
                          )}
                        </div>

                        {description && (
                          <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {description}
                          </p>
                        )}
                      </div>

                      <ActionsMenu
                        items={[
                          {
                            label: 'Modifier',
                            icon: <Edit size={16} />,
                            onClick: () => router.push(editHref),
                          },
                          statut === StatutFormation.ARCHIVEE
                            ? {
                                label: 'Supprimer',
                                icon: <Trash2 size={16} />,
                                variant: 'danger' as const,
                                onClick: () => {
                                  setDeleteTarget({ id: row.id, kind: row.kind });
                                  setDeleteModalOpen(true);
                                },
                              }
                            : {
                                label: 'Archiver',
                                icon: <Archive size={16} />,
                                onClick: () => {
                                  setArchiveTarget({ id: row.id, kind: row.kind });
                                  setArchiveModalOpen(true);
                                },
                              },
                        ]}
                      />
                    </div>

                    {/* Métadonnées */}
                    <div className="mt-5 border-t border-gray-100" />
                    <div className="mt-4 space-y-2.5">
                      {!isModulaire && (row.data as Formation).domaine && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen size={15} className="text-gray-400" />
                          <span>{(row.data as Formation).domaine!.nom}</span>
                        </div>
                      )}

                      {!isModulaire && (row.data as Formation).mention && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Bookmark size={15} className="text-gray-400" />
                          <span>{(row.data as Formation).mention!.titre}</span>
                        </div>
                      )}

                      {!isModulaire && (row.data as Formation).duree_formation && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={15} className="text-gray-400" />
                          <span>{(row.data as Formation).duree_formation}</span>
                        </div>
                      )}

                      {isModulaire && (row.data as FormationModulaire).duree_heures != null && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={15} className="text-gray-400" />
                          <span>{(row.data as FormationModulaire).duree_heures} heures</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                      {/* Bouton pour voir plus (formations principales uniquement) */}
                      {!isModulaire && (row.data as Formation).type_formation === 'PRINCIPALE' ? (
                        <button
                          onClick={() => setExpandedFormation(
                            expandedFormation === row.id ? null : row.id
                          )}
                          className="text-sm text-isdb-green-600 hover:text-isdb-green-700 flex items-center gap-1 font-medium"
                        >
                          {expandedFormation === row.id ? (
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
                      ) : <span />}

                      <div className="flex items-center gap-2">
                        {!isModulaire && (
                          <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                            {(row.data as Formation).offresFormations?.length || 0} offre(s)
                          </span>
                        )}
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium",
                          statut === StatutFormation.ACTIVE
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        )}>
                          {statut === StatutFormation.ACTIVE ? 'Active' : 'Archivée'}
                        </span>
                        <button
                          onClick={() => router.push(viewHref)}
                          className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          Voir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section étendue (formations principales uniquement) */}
                  {!isModulaire && expandedFormation === row.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Objectifs</h4>
                          <div className="prose prose-sm max-w-none text-gray-600">
                            {(row.data as Formation).objectifs ? (
                              <div dangerouslySetInnerHTML={{ __html: (row.data as Formation).objectifs! }} />
                            ) : (
                              <p className="text-gray-400 italic">Non spécifié</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Profil de sortie</h4>
                          <div className="prose prose-sm max-w-none text-gray-600">
                            {(row.data as Formation).profile_sortie ? (
                              <div dangerouslySetInnerHTML={{ __html: (row.data as Formation).profile_sortie! }} />
                            ) : (
                              <p className="text-gray-400 italic">Non spécifié</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                          <div className="space-y-2">
                            <Link
                              href={`/dashboard/formations/${row.id}/offres`}
                              className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center transition-colors"
                            >
                              Gérer les offres
                            </Link>
                            {(row.data as Formation).programme_pdf && (
                              <a
                                href={(row.data as Formation).programme_pdf!}
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
              );
            })}

            {/* Bouton "Voir plus" pour la pagination infinie (formations principales) */}
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
              {filters.search || Object.values(filters).some(v => v !== '' && v !== StatutFormation.ACTIVE)
                ? 'Aucun résultat pour votre recherche. Essayez de modifier vos filtres.'
                : 'Commencez par créer votre première formation.'}
            </p>
            {!filters.search && Object.values(filters).every(v => v === '' || v === StatutFormation.ACTIVE) && (
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

      {/* Modal de confirmation : archivage */}
      <ConfirmModal
        isOpen={archiveModalOpen}
        onClose={() => {
          setArchiveModalOpen(false);
          setArchiveTarget(null);
        }}
        onConfirm={handleArchive}
        title="Archiver la formation"
        message="Êtes-vous sûr de vouloir archiver cette formation ? Elle ne sera plus visible pour les visiteurs mais restera accessible en consultation."
        confirmText="Archiver"
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
      />

      {/* Modal de confirmation : suppression (formations déjà archivées uniquement) */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer la formation"
        message="Êtes-vous sûr de vouloir supprimer définitivement cette formation ? Elle ne sera plus accessible nulle part, y compris dans le dashboard."
        confirmText="Supprimer"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
