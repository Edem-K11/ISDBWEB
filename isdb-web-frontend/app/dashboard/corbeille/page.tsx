'use client';

import { useState } from 'react';
import { mutate as globalMutate } from 'swr';
import {
  Trash2,
  RotateCcw,
  GraduationCap,
  Layers,
  Bookmark,
  ClipboardList,
  Loader2,
  Inbox,
  AlertTriangle,
  Building,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  useFormationsTrashed,
  useFormationsModulairesTrashed,
  useDomainesTrashed,
  useMentionsTrashed,
  useOffresTrashed,
} from '@/lib/hooks/useCorbeille';
import { formationService } from '@/lib/api/services/formationService';
import { formationModulaireService } from '@/lib/api/services/formationModulaireService';
import { domaineService } from '@/lib/api/services/domaineService';
import { mentionService } from '@/lib/api/services/mentionService';
import { offreFormationService } from '@/lib/api/services/offreFormationService';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/confirmModal';

type TabKey = 'formations' | 'domaines' | 'mentions' | 'offres';

// Après une restauration/suppression définitive, on revalide les caches des
// écrans "normaux" de la ressource concernée en plus de la corbeille elle-même
// — sinon un élément restauré resterait invisible dans sa liste habituelle
// jusqu'à expiration du cache (jusqu'à 5 min, dedupingInterval).
function revalidateFormations() {
  globalMutate((key) => Array.isArray(key) && (key[0] === 'formations' || key[0] === 'formations-infinite'));
  globalMutate('formation-stats');
}
function revalidateFormationsModulaires() {
  globalMutate((key) => Array.isArray(key) && key[0] === 'formations-modulaires-dashboard');
}
function revalidateDomaines() {
  globalMutate('Domaines');
}
function revalidateMentions() {
  globalMutate('Mentions');
}
function revalidateOffres() {
  globalMutate((key) => Array.isArray(key) && key[0] === 'offres-formations');
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function CorbeillePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('formations');

  const formationsTrashed = useFormationsTrashed();
  const formationsModulairesTrashed = useFormationsModulairesTrashed();
  const domainesTrashed = useDomainesTrashed();
  const mentionsTrashed = useMentionsTrashed();
  const offresTrashed = useOffresTrashed();

  // État de la fenêtre de confirmation de suppression définitive, commun aux
  // 4 onglets (une seule action irréversible à la fois).
  const [confirmTarget, setConfirmTarget] = useState<{
    resource: TabKey | 'formations-modulaires';
    id: number;
    label: string;
  } | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const busyKey = (resource: string, id: number) => `${resource}-${id}`;

  const tabs: { key: TabKey; label: string; icon: typeof GraduationCap; count: number }[] = [
    {
      key: 'formations',
      label: 'Formations',
      icon: GraduationCap,
      count: formationsTrashed.formations.length + formationsModulairesTrashed.formations.length,
    },
    { key: 'domaines', label: 'Domaines', icon: Layers, count: domainesTrashed.domaines.length },
    { key: 'mentions', label: 'Mentions', icon: Bookmark, count: mentionsTrashed.mentions.length },
    { key: 'offres', label: 'Offres de formation', icon: ClipboardList, count: offresTrashed.offres.length },
  ];

  const totalCount = tabs.reduce((sum, t) => sum + t.count, 0);

  // --- Restaurer ---

  const handleRestoreFormation = async (id: number, titre: string) => {
    setPendingAction(busyKey('formations', id));
    try {
      await formationService.restore(id);
      toast.success(`« ${titre} » restaurée avec succès`);
      await formationsTrashed.mutate();
      revalidateFormations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la restauration');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRestoreFormationModulaire = async (id: number, titre: string) => {
    setPendingAction(busyKey('formations-modulaires', id));
    try {
      await formationModulaireService.restore(id);
      toast.success(`« ${titre} » restaurée avec succès`);
      await formationsModulairesTrashed.mutate();
      revalidateFormationsModulaires();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la restauration');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRestoreDomaine = async (id: number, nom: string) => {
    setPendingAction(busyKey('domaines', id));
    try {
      await domaineService.restore(id);
      toast.success(`« ${nom} » restauré avec succès`);
      await domainesTrashed.mutate();
      revalidateDomaines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la restauration');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRestoreMention = async (id: number, titre: string) => {
    setPendingAction(busyKey('mentions', id));
    try {
      await mentionService.restore(id);
      toast.success(`« ${titre} » restaurée avec succès`);
      await mentionsTrashed.mutate();
      revalidateMentions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la restauration');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRestoreOffre = async (id: number, titre: string) => {
    setPendingAction(busyKey('offres', id));
    try {
      await offreFormationService.restore(id);
      toast.success(`Offre « ${titre} » restaurée avec succès`);
      await offresTrashed.mutate();
      revalidateOffres();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la restauration');
    } finally {
      setPendingAction(null);
    }
  };

  // --- Suppression définitive ---

  const handleConfirmForceDelete = async () => {
    if (!confirmTarget) return;
    const { resource, id, label } = confirmTarget;

    setPendingAction(busyKey(resource, id));
    try {
      switch (resource) {
        case 'formations':
          await formationService.forceDelete(id);
          await formationsTrashed.mutate();
          revalidateFormations();
          break;
        case 'formations-modulaires':
          await formationModulaireService.forceDelete(id);
          await formationsModulairesTrashed.mutate();
          revalidateFormationsModulaires();
          break;
        case 'domaines':
          await domaineService.forceDelete(id);
          await domainesTrashed.mutate();
          revalidateDomaines();
          break;
        case 'mentions':
          await mentionService.forceDelete(id);
          await mentionsTrashed.mutate();
          revalidateMentions();
          break;
        case 'offres':
          await offreFormationService.forceDelete(id);
          await offresTrashed.mutate();
          revalidateOffres();
          break;
      }
      toast.success(`« ${label} » supprimé définitivement`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression définitive');
    } finally {
      setPendingAction(null);
      setConfirmTarget(null);
    }
  };

  const renderEmpty = (label: string) => (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="text-gray-400" size={28} />
      </div>
      <h3 className="text-base font-medium text-gray-900 mb-1">Corbeille vide</h3>
      <p className="text-sm text-gray-500">Aucun{label === 'e' ? 'e' : ''} {label} supprimé{label === 'e' ? 'e' : ''} pour le moment.</p>
    </div>
  );

  const isAnyLoading =
    formationsTrashed.isLoading ||
    formationsModulairesTrashed.isLoading ||
    domainesTrashed.isLoading ||
    mentionsTrashed.isLoading ||
    offresTrashed.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-100 rounded-xl">
            <Trash2 className="text-gray-600" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Corbeille</h1>
            <p className="text-gray-600 mt-0.5 text-sm">
              Formations, domaines, mentions et offres supprimés récemment. Restaurez-les ou
              supprimez-les définitivement.
            </p>
          </div>
        </div>
      </div>

      {/* Bandeau d'info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-amber-900">
          Un élément supprimé depuis le dashboard atterrit ici plutôt que d'être effacé
          immédiatement. Tant qu'il reste dans cette liste, il est encore récupérable via
          <span className="font-medium"> Restaurer</span>. La
          <span className="font-medium"> Suppression définitive</span> est en revanche
          irréversible.
        </p>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-isdb-green-500 text-isdb-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-isdb-green-100 text-isdb-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu */}
      {isAnyLoading && totalCount === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'formations' && (
            <div className="space-y-3">
              {formationsTrashed.formations.length === 0 && formationsModulairesTrashed.formations.length === 0 ? (
                renderEmpty('e formation')
              ) : (
                <>
                  {formationsTrashed.formations.map((formation) => (
                    <div
                      key={`formation-${formation.id}`}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                          <GraduationCap className="text-blue-600" size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{formation.titre}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant={formation.type_formation === 'MODULAIRE' ? 'warning' : 'info'} size="sm">
                              {formation.type_formation === 'MODULAIRE' ? 'Modulaire' : 'Principale'}
                            </Badge>
                            {formation.mention && (
                              <span className="text-xs text-gray-500">{formation.mention.titre}</span>
                            )}
                            <span className="text-xs text-gray-400">
                              Supprimée le {formatDate(formation.deleted_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRestoreFormation(formation.id, formation.titre)}
                          disabled={pendingAction === busyKey('formations', formation.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {pendingAction === busyKey('formations', formation.id) ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RotateCcw size={14} />
                          )}
                          Restaurer
                        </button>
                        <button
                          onClick={() =>
                            setConfirmTarget({ resource: 'formations', id: formation.id, label: formation.titre })
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 size={14} />
                          Supprimer définitivement
                        </button>
                      </div>
                    </div>
                  ))}

                  {formationsModulairesTrashed.formations.map((formation) => (
                    <div
                      key={`formation-modulaire-${formation.id}`}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                          <BookOpen className="text-emerald-600" size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{formation.titre}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="success" size="sm">Modulaire (autonome)</Badge>
                            <span className="text-xs text-gray-400">
                              Supprimée le {formatDate(formation.deleted_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRestoreFormationModulaire(formation.id, formation.titre)}
                          disabled={pendingAction === busyKey('formations-modulaires', formation.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {pendingAction === busyKey('formations-modulaires', formation.id) ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RotateCcw size={14} />
                          )}
                          Restaurer
                        </button>
                        <button
                          onClick={() =>
                            setConfirmTarget({
                              resource: 'formations-modulaires',
                              id: formation.id,
                              label: formation.titre,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 size={14} />
                          Supprimer définitivement
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'domaines' && (
            <div className="space-y-3">
              {domainesTrashed.domaines.length === 0 ? (
                renderEmpty('domaine')
              ) : (
                domainesTrashed.domaines.map((domaine) => (
                  <div
                    key={domaine.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-isdb-green-50 rounded-lg shrink-0">
                        <Layers className="text-isdb-green-700" size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{domaine.nom}</p>
                        <span className="text-xs text-gray-400">
                          Supprimé le {formatDate(domaine.deletedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRestoreDomaine(domaine.id, domaine.nom)}
                        disabled={pendingAction === busyKey('domaines', domaine.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {pendingAction === busyKey('domaines', domaine.id) ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        Restaurer
                      </button>
                      <button
                        onClick={() => setConfirmTarget({ resource: 'domaines', id: domaine.id, label: domaine.nom })}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={14} />
                        Supprimer définitivement
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'mentions' && (
            <div className="space-y-3">
              {mentionsTrashed.mentions.length === 0 ? (
                renderEmpty('e mention')
              ) : (
                mentionsTrashed.mentions.map((mention) => (
                  <div
                    key={mention.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-isdb-gold-50 rounded-lg shrink-0">
                        <Bookmark className="text-isdb-gold-700" size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{mention.titre}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {mention.domaine && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Building size={11} />
                              {mention.domaine.nom}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Supprimée le {formatDate(mention.deleted_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRestoreMention(mention.id, mention.titre)}
                        disabled={pendingAction === busyKey('mentions', mention.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {pendingAction === busyKey('mentions', mention.id) ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        Restaurer
                      </button>
                      <button
                        onClick={() => setConfirmTarget({ resource: 'mentions', id: mention.id, label: mention.titre })}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={14} />
                        Supprimer définitivement
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'offres' && (
            <div className="space-y-3">
              {offresTrashed.offres.length === 0 ? (
                renderEmpty('e offre')
              ) : (
                offresTrashed.offres.map((offre) => (
                  <div
                    key={offre.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                        <ClipboardList className="text-indigo-600" size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {offre.formation?.titre || `Formation #${offre.formation_id}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {offre.annee_academique && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={11} />
                              {offre.annee_academique.libelle}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Supprimée le {formatDate(offre.deleted_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          handleRestoreOffre(offre.id, offre.formation?.titre || `Formation #${offre.formation_id}`)
                        }
                        disabled={pendingAction === busyKey('offres', offre.id)}
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {pendingAction === busyKey('offres', offre.id) ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        Restaurer
                      </button>
                      <button
                        onClick={() =>
                          setConfirmTarget({
                            resource: 'offres',
                            id: offre.id,
                            label: offre.formation?.titre || `Formation #${offre.formation_id}`,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 size={14} />
                        Supprimer définitivement
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirmForceDelete}
        title="Suppression définitive"
        message={`« ${confirmTarget?.label ?? ''} » sera supprimé(e) définitivement et ne pourra plus être récupéré(e). Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
