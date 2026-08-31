'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR, { mutate as globalMutate } from 'swr';
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckSquare,
  Square,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAnneesAcademiques } from '@/lib/hooks/useAnneeAcademique';
import { anneeAcademiqueService } from '@/lib/api/services/anneeAcademiqueService';
import { SelectWithSearch } from '@/components/ui/selectWithSearch';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '@/components/ui/confirmModal';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { TypeFormation } from '@/lib/types/Formation';
import type { AnneeAcademique } from '@/lib/types/AnneeAcademique';
import type { OffreFormation } from '@/lib/types/OffreFormation';

// Même règle que côté backend : une année est terminée si sa date de fin est passée.
function estAnneeTerminee(annee: Pick<AnneeAcademique, 'date_fin'>): boolean {
  return annee.date_fin ? new Date() > new Date(annee.date_fin) : false;
}

function ReconduireOffresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get('source');

  const { annees, isLoading: isLoadingAnnees } = useAnneesAcademiques();

  const [sourceId, setSourceId] = useState<number | ''>('');
  const [cibleId, setCibleId] = useState<number | ''>('');
  const [selectedOffreIds, setSelectedOffreIds] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Présélection de la source : l'année passée en paramètre (venant du bouton d'une
  // page de détails), sinon la dernière année terminée en date — c'est le cas d'usage
  // principal (« l'année qui vient de finir »).
  useEffect(() => {
    if (!annees.length || sourceId !== '') return;

    if (sourceParam) {
      const fromParam = annees.find((a) => a.id === parseInt(sourceParam, 10));
      if (fromParam) {
        setSourceId(fromParam.id);
        return;
      }
    }

    const terminees = [...annees]
      .filter(estAnneeTerminee)
      .sort((a, b) => (b.date_fin || '').localeCompare(a.date_fin || ''));
    if (terminees[0]) setSourceId(terminees[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annees, sourceParam]);

  // Présélection de la cible : l'année en cours (si ce n'est pas déjà la source et
  // qu'elle n'est pas terminée), sinon la première année non terminée disponible.
  useEffect(() => {
    if (!annees.length || cibleId !== '' || sourceId === '') return;
    const candidate =
      annees.find((a) => a.est_actuelle && a.id !== sourceId && !estAnneeTerminee(a)) ||
      annees.find((a) => a.id !== sourceId && !estAnneeTerminee(a));
    if (candidate) setCibleId(candidate.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annees, sourceId]);

  const { data: offresSource, isLoading: isLoadingSource } = useSWR<OffreFormation[]>(
    sourceId ? `Annee/${sourceId}/Offres` : null,
    () => anneeAcademiqueService.getOffres(sourceId as number),
    { revalidateOnFocus: false }
  );

  const { data: offresCible, isLoading: isLoadingCible } = useSWR<OffreFormation[]>(
    cibleId ? `Annee/${cibleId}/Offres` : null,
    () => anneeAcademiqueService.getOffres(cibleId as number),
    { revalidateOnFocus: false }
  );

  // Formations déjà offertes pour l'année cible : on les affiche mais on empêche de
  // les recocher, exactement comme le backend les ignorerait de toute façon.
  const formationIdsDejaOffertes = useMemo(
    () => new Set((offresCible || []).map((o) => o.formation_id)),
    [offresCible]
  );

  const selectableOffres = useMemo(
    () => (offresSource || []).filter((o) => !formationIdsDejaOffertes.has(o.formation_id)),
    [offresSource, formationIdsDejaOffertes]
  );

  // Dès que la liste des offres reconductibles est connue (nouvelle source/cible),
  // on les sélectionne toutes par défaut.
  useEffect(() => {
    setSelectedOffreIds(new Set(selectableOffres.map((o) => o.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceId, cibleId, offresSource, offresCible]);

  const sourceAnnee = annees.find((a) => a.id === sourceId);
  const cibleAnnee = annees.find((a) => a.id === cibleId);
  const cibleEstTerminee = cibleAnnee ? estAnneeTerminee(cibleAnnee) : false;

  const anneeOptions = annees.map((a) => ({ value: a.id, label: a.libelle }));
  const cibleOptions = annees
    .filter((a) => a.id !== sourceId && !estAnneeTerminee(a))
    .map((a) => ({ value: a.id, label: a.libelle }));

  const toggleOffre = (offreId: number, disabled: boolean) => {
    if (disabled) return;
    setSelectedOffreIds((prev) => {
      const next = new Set(prev);
      if (next.has(offreId)) next.delete(offreId);
      else next.add(offreId);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedOffreIds.size === selectableOffres.length) {
      setSelectedOffreIds(new Set());
    } else {
      setSelectedOffreIds(new Set(selectableOffres.map((o) => o.id)));
    }
  };

  const handleReconduire = async () => {
    if (!sourceId || !cibleId || selectedOffreIds.size === 0) return;

    setIsSubmitting(true);
    try {
      const result = await anneeAcademiqueService.reconduireOffres(sourceId, {
        annee_cible_id: cibleId,
        offre_ids: Array.from(selectedOffreIds),
      });

      toast.success(result.message || 'Reconduction effectuée avec succès');

      await Promise.all([
        globalMutate(`Annee/${cibleId}/Offres`),
        globalMutate(`annee-academique-${cibleId}`),
        globalMutate('annees-academiques'),
      ]);

      router.push(`/dashboard/offres-formations?annee_academique_id=${cibleId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la reconduction des offres');
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  if (isLoadingAnnees) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-isdb-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href={ENDPOINTS.DASHBOARD_ANNEES_ACADEMIQUES}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux années académiques
        </Link>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-50">
            <RefreshCw className="text-purple-700" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reconduire les offres</h1>
            <p className="text-gray-600 mt-1">
              Reportez les offres de formation d'une année académique vers une autre. Les
              formations déjà offertes pour l'année cible ne seront jamais dupliquées.
            </p>
          </div>
        </div>
      </div>

      {/* Sélection des années */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectWithSearch
            label="Année source (offres à reconduire)"
            options={anneeOptions}
            value={sourceId}
            onChange={(value) => {
              const newSourceId = value as number;
              setSourceId(newSourceId);
              if (newSourceId === cibleId) setCibleId('');
            }}
            placeholder="Choisir l'année source"
            required
          />
          <SelectWithSearch
            label="Année cible (qui reçoit les offres)"
            options={cibleOptions}
            value={cibleId}
            onChange={(value) => setCibleId(value as number)}
            placeholder="Choisir l'année cible"
            required
          />
        </div>
        {cibleEstTerminee && (
          <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            Impossible de reconduire vers une année déjà terminée.
          </p>
        )}
      </div>

      {/* Liste des offres */}
      {sourceId && cibleId ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Offres de {sourceAnnee?.libelle}
            </h2>
            {selectableOffres.length > 0 && (
              <button
                type="button"
                onClick={toggleAll}
                className="text-sm font-medium text-isdb-green-600 hover:underline"
              >
                {selectedOffreIds.size === selectableOffres.length
                  ? 'Tout désélectionner'
                  : 'Tout sélectionner'}
              </button>
            )}
          </div>

          {isLoadingSource || isLoadingCible ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : offresSource && offresSource.length > 0 ? (
            <div className="space-y-2">
              {offresSource.map((offre) => {
                const dejaOfferte = formationIdsDejaOffertes.has(offre.formation_id);
                const checked = selectedOffreIds.has(offre.id);
                return (
                  <div
                    key={offre.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      dejaOfferte
                        ? 'border-gray-100 bg-gray-50'
                        : 'border-gray-100 hover:bg-gray-50 cursor-pointer'
                    }`}
                    onClick={() => toggleOffre(offre.id, dejaOfferte)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOffre(offre.id, dejaOfferte);
                      }}
                      disabled={dejaOfferte}
                      className="shrink-0"
                    >
                      {checked ? (
                        <CheckSquare className="text-isdb-green-600" size={20} />
                      ) : (
                        <Square className={dejaOfferte ? 'text-gray-300' : 'text-gray-400'} size={20} />
                      )}
                    </button>

                    <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                      <GraduationCap className="text-blue-600" size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {offre.formation?.titre || `Formation #${offre.formation_id}`}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant={offre.formation?.type_formation === TypeFormation.MODULAIRE ? 'warning' : 'info'}
                          size="sm"
                        >
                          {offre.formation?.type_formation === TypeFormation.MODULAIRE ? 'Modulaire' : 'Principale'}
                        </Badge>
                        {offre.chef_parcours && (
                          <span className="text-xs text-gray-500">
                            Chef de parcours : {offre.chef_parcours}
                          </span>
                        )}
                      </div>
                    </div>

                    {dejaOfferte && (
                      <span className="text-xs font-medium text-gray-500 shrink-0">
                        Déjà offerte pour {cibleAnnee?.libelle}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Aucune offre de formation trouvée pour {sourceAnnee?.libelle}.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
          Sélectionnez une année source et une année cible pour afficher les offres à reconduire.
        </div>
      )}

      {/* Action */}
      {sourceId && cibleId && offresSource && offresSource.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isSubmitting || selectedOffreIds.size === 0 || cibleEstTerminee}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
            Reconduire {selectedOffreIds.size} offre(s) vers {cibleAnnee?.libelle}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleReconduire}
        title="Reconduire les offres"
        message={`${selectedOffreIds.size} offre(s) de ${sourceAnnee?.libelle} seront créées pour ${cibleAnnee?.libelle}. Les formations déjà offertes pour ${cibleAnnee?.libelle} ne seront pas dupliquées, et cette action peut être répétée sans risque.`}
        confirmText="Reconduire"
        confirmButtonClass="bg-purple-600 hover:bg-purple-700"
      />
    </div>
  );
}

export default function ReconduireOffresPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-isdb-green-600 animate-spin" />
        </div>
      }
    >
      <ReconduireOffresContent />
    </Suspense>
  );
}
