<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnneeAcademique;
use App\Models\OffreFormation;
use App\Http\Requests\StoreAnneeAcademiqueRequest;
use App\Http\Requests\UpdateAnneeAcademiqueRequest;
use App\Http\Resources\AnneeAcademiqueResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class AnneeAcademiqueController extends Controller
{
    /**
     * Display a listing of années académiques.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AnneeAcademique::query();

        // Eager loading automatique avec le nombre d'offres
        $query->withCount('offresFormations')
              ->with(['offresFormations' => function($q) {
                  $q->select('id', 'annee_academique_id', 'formation_id', 'est_dispensee')
                    ->with('formation:id,titre,type_formation');
              }]);

        // Filtres
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('annee_debut', 'LIKE', "%{$search}%")
                  ->orWhere('annee_fin', 'LIKE', "%{$search}%")
                  ->orWhereRaw("CONCAT(annee_debut, '-', annee_fin) LIKE ?", ["%{$search}%"]);
            });
        }

        if ($request->boolean('actuelle_only')) {
            $query->actuelle();
        }

        if ($request->boolean('futures_only')) {
            $query->futures();
        }

        if ($request->boolean('passees_only')) {
            $query->passees();
        }

        // Tri personnalisé : année actuelle en premier, puis par date décroissante
        $query->orderByRaw('est_actuelle DESC')
              ->orderBy('annee_debut', 'DESC');


        $annees = $query->get();
        $total = AnneeAcademique::count();
        
        return response()->json([
            'success' => true,
            'data' => AnneeAcademiqueResource::collection($annees),
            'meta' => [
                'total' => $total,
                'displayed' => $annees->count(),
                'annee_actuelle' => $annees->firstWhere('est_actuelle', true)?->libelle
            ]
        ]);
    }

    /**
     * Store a newly created année académique.
     */
    public function store(StoreAnneeAcademiqueRequest $request): JsonResponse
    {

        $data = $request->validated();
        
        $annee = AnneeAcademique::create($data);

        // Déterminer automatiquement si cette année doit être actuelle
        $this->updateAnneeActuelle();

        return response()->json([
            'success' => true,
            'message' => 'Année académique créée avec succès.',
            'data' => new AnneeAcademiqueResource($annee->fresh())
        ], 201);
    }

    /**
     * Display the specified année académique.
     */
    public function show(Request $request,  $id): JsonResponse
    {
        $anneeAcademique = AnneeAcademique::findOrFail($id);
        // Eager loading complet pour la vue détaillée
        $anneeAcademique->load(['offresFormations' => function($q) {
            $q->with(['formation.mention.domaine']);
        }]);

        // Déterminer si l'année est terminée
        $estTerminee = $this->isAnneeTerminee($anneeAcademique);

        return response()->json([
            'success' => true,
            'data' => new AnneeAcademiqueResource($anneeAcademique),
            'meta' => [
                'est_terminee' => $estTerminee,
                'peut_modifier' => !$estTerminee,
                'peut_supprimer' => !$estTerminee && $anneeAcademique->offresFormations()->count() === 0,
            ]
        ]);
    }

    /**
     * Update the specified année académique.
     */
    public function update(UpdateAnneeAcademiqueRequest $request,  $id): JsonResponse
    {
        $anneeAcademique = AnneeAcademique::findOrFail($id);

        // Vérifier si l'année est terminée
        if ($this->isAnneeTerminee($anneeAcademique)) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de modifier une année académique terminée.'
            ], 422);
        }

        $data = $request->validated();
        
        $anneeAcademique->update($data);

        // Recalculer automatiquement quelle année doit être actuelle
        $this->updateAnneeActuelle();

        return response()->json([
            'success' => true,
            'message' => 'Année académique mise à jour avec succès.',
            'data' => new AnneeAcademiqueResource($anneeAcademique->fresh())
        ]);
    }

    /**
     * Remove the specified année académique (soft delete).
     */
    public function destroy( $id): JsonResponse
    {
        $anneeAcademique = AnneeAcademique::findOrFail($id);
        // Vérifier si l'année est terminée
        if ($this->isAnneeTerminee($anneeAcademique)) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une année académique terminée. Les données doivent être conservées.'
            ], 422);
        }

        // Vérifier s'il y a des offres de formation
        if ($anneeAcademique->offresFormations()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette année car elle contient des offres de formation.'
            ], 422);
        }

        $anneeAcademique->delete();

        // Recalculer l'année actuelle après suppression
        $this->updateAnneeActuelle();

        return response()->json([
            'success' => true,
            'message' => 'Année académique supprimée avec succès.'
        ]);
    }

    /**
     * Get the current année académique.
     */
    public function actuelle(Request $request): JsonResponse
    {

        $annee = AnneeAcademique::actuelle()->first();

        if (!$annee) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune année académique actuelle définie.'
            ], 404);
        }

        $annee->load(['offresFormations.formation.mention.domaine']);

        return response()->json([
            'success' => true,
            'data' => new AnneeAcademiqueResource($annee)
        ]);
    }

    /**
     * Reconduire les offres de formation d'une année à une autre.
     */
    public function reconduireOffres(Request $request, AnneeAcademique $anneeSource): JsonResponse
    {
        $request->validate([
            'annee_cible_id' => 'required|exists:annees_academiques,id',
            'offre_ids' => 'nullable|array',
            'offre_ids.*' => 'exists:offres_formations,id',
        ]);

        $anneeCible = AnneeAcademique::findOrFail($request->annee_cible_id);

        // Vérifier que l'année cible n'est pas terminée
        if ($this->isAnneeTerminee($anneeCible)) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de reconduire vers une année académique terminée.'
            ], 422);
        }

        // Vérifier que l'année cible est différente
        if ($anneeSource->id === $anneeCible->id) {
            return response()->json([
                'success' => false,
                'message' => 'L\'année source et l\'année cible doivent être différentes.'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $offresQuery = $anneeSource->offresFormations();
            
            if ($request->has('offre_ids') && !empty($request->offre_ids)) {
                $offresQuery->whereIn('id', $request->offre_ids);
            }

            $offresSource = $offresQuery->with('formation')->get();

            if ($offresSource->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune offre à reconduire.'
                ], 422);
            }

            $offresCreated = 0;
            $offresSkipped = 0;
            $errors = [];

            foreach ($offresSource as $offreSource) {
                // Vérifier si une offre existe déjà
                $existingOffre = OffreFormation::where('formation_id', $offreSource->formation_id)
                    ->where('annee_academique_id', $anneeCible->id)
                    ->first();

                if ($existingOffre) {
                    $offresSkipped++;
                    $errors[] = "Formation '{$offreSource->formation->titre}' déjà offerte pour {$anneeCible->libelle}";
                    continue;
                }

                // Créer la nouvelle offre
                OffreFormation::create([
                    'formation_id' => $offreSource->formation_id,
                    'annee_academique_id' => $anneeCible->id,
                    'chef_parcours' => $offreSource->chef_parcours,
                    'animateur' => $offreSource->animateur,
                    'date_debut' => null,
                    'date_fin' => null,
                    'place_limited' => $offreSource->place_limited,
                    'prix' => $offreSource->prix,
                    'est_dispensee' => false,
                ]);

                $offresCreated++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Reconduction terminée : {$offresCreated} offre(s) créée(s), {$offresSkipped} ignorée(s).",
                'data' => [
                    'offres_created' => $offresCreated,
                    'offres_skipped' => $offresSkipped,
                    'errors' => $errors,
                    'annee_source' => $anneeSource->libelle,
                    'annee_cible' => $anneeCible->libelle,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la reconduction : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all offres for a specific année académique.
     */
    public function offres(Request $request, AnneeAcademique $anneeAcademique): JsonResponse
    {
        $query = $anneeAcademique->offresFormations()->with(['formation.mention.domaine']);

        // Filtres
        if ($request->has('type_formation')) {
            if ($request->input('type_formation') === 'PRINCIPALE') {
                $query->formationsPrincipales();
            } elseif ($request->input('type_formation') === 'MODULAIRE') {
                $query->formationsModulaires();
            }
        }

        if ($request->boolean('dispensees_only')) {
            $query->dispensees();
        }

        if ($request->has('domaine_id')) {
            $query->whereHas('formation.mention', function($q) use ($request) {
                $q->where('domaine_id', $request->input('domaine_id'));
            });
        }

        $offres = $query->get();

        return response()->json([
            'success' => true,
            'data' => \App\Http\Resources\OffreFormationResource::collection($offres),
            'meta' => [
                'est_terminee' => $this->isAnneeTerminee($anneeAcademique),
                'peut_modifier' => !$this->isAnneeTerminee($anneeAcademique),
            ]
        ]);
    }

    /**
     * Get statistics for an année académique.
     */
    public function statistics(AnneeAcademique $anneeAcademique): JsonResponse
    {
        $offres = $anneeAcademique->offresFormations;

        return response()->json([
            'success' => true,
            'data' => [
                'libelle' => $anneeAcademique->libelle,
                'est_actuelle' => $anneeAcademique->est_actuelle,
                'est_terminee' => $this->isAnneeTerminee($anneeAcademique),
                'nombre_offres' => $offres->count(),
                'offres_dispensees' => $offres->where('est_dispensee', true)->count(),
                'formations_principales' => $anneeAcademique->offresFormations()
                    ->formationsPrincipales()
                    ->count(),
                'formations_modulaires' => $anneeAcademique->offresFormations()
                    ->formationsModulaires()
                    ->count(),
                'places_totales' => $offres->sum('place_limited'),
                'offres_avec_places_limitees' => $offres->whereNotNull('place_limited')->count()
            ]
        ]);
    }

    /**
     * Méthode privée pour déterminer automatiquement l'année actuelle.
     */
    private function updateAnneeActuelle(): void
    {
        $now = Carbon::today();

        // 1. Désactiver uniquement l'année actuellement marquée
        AnneeAcademique::where('est_actuelle', true)
            ->update(['est_actuelle' => false]);

        // 2. Trouver l'année correspondant à la date actuelle
        $anneeActuelle = AnneeAcademique::whereDate('date_debut', '<=', $now)
            ->whereDate('date_fin', '>=', $now)
            ->orderBy('date_debut')
            ->first();

        // 3. Marquer comme actuelle
        if ($anneeActuelle) {
            $anneeActuelle->forceFill([
                'est_actuelle' => true
            ])->save();
        }
    }


    /**
     * Vérifier si une année académique est terminée.
     */
    private function isAnneeTerminee(AnneeAcademique $annee): bool
    {
        if (!$annee->date_fin) {
            return false;
        }

        return now()->isAfter($annee->date_fin);
    }

    /**
     * Restore a soft-deleted année académique.
     */
    public function restore(int $id): JsonResponse
    {
        $annee = AnneeAcademique::withTrashed()->findOrFail($id);
        
        if (!$annee->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette année académique n\'est pas supprimée.'
            ], 422);
        }

        $annee->restore();

        // Recalculer l'année actuelle
        $this->updateAnneeActuelle();

        return response()->json([
            'success' => true,
            'message' => 'Année académique restaurée avec succès.',
            'data' => new AnneeAcademiqueResource($annee)
        ]);
    }

    /**
     * Permanently delete an année académique.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $annee = AnneeAcademique::withTrashed()->findOrFail($id);

        // Vérifier si l'année est terminée
        if ($this->isAnneeTerminee($annee)) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer définitivement une année académique terminée.'
            ], 422);
        }

        // Vérifier s'il y a des offres
        if ($annee->offresFormations()->withTrashed()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer définitivement cette année car elle contient des offres de formation.'
            ], 422);
        }

        $annee->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Année académique supprimée définitivement.'
        ]);
    }
}