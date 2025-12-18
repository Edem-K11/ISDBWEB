<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnneeAcademique;
use App\Http\Requests\StoreAnneeAcademiqueRequest;
use App\Http\Requests\UpdateAnneeAcademiqueRequest;
use App\Http\Resources\AnneeAcademiqueResource;
use App\Http\Resources\AnneeAcademiqueCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AnneeAcademiqueController extends Controller
{
    /**
     * Display a listing of années académiques.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AnneeAcademique::query();

        // Eager loading
        if ($request->has('with_offres')) {
            $query->with('offresFormations.formation');
        }

        // Filtres
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('annee_debut', 'LIKE', "%{$search}%")
                  ->orWhere('annee_fin', 'LIKE', "%{$search}%");
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

        // Tri (par défaut, les plus récentes en premier)
        $sortBy = $request->input('sort_by', 'annee_debut');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        if ($request->has('per_page')) {
            $annees = $query->paginate($request->input('per_page', 15));
            return response()->json(new AnneeAcademiqueCollection($annees));
        }

        $annees = $query->get();
        return response()->json([
            'success' => true,
            'data' => AnneeAcademiqueResource::collection($annees),
            'meta' => [
                'total' => $annees->count(),
                'annee_actuelle' => $annees->firstWhere('est_actuelle', true)?->libelle
            ]
        ]);
    }

    /**
     * Store a newly created année académique.
     */
    public function store(StoreAnneeAcademiqueRequest $request): JsonResponse
    {
        $annee = AnneeAcademique::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Année académique créée avec succès.',
            'data' => new AnneeAcademiqueResource($annee)
        ], 201);
    }

    /**
     * Display the specified année académique.
     */
    public function show(Request $request, AnneeAcademique $anneeAcademique): JsonResponse
    {
        if ($request->has('with_offres')) {
            $anneeAcademique->load('offresFormations.formation.mention.domaine');
        }

        return response()->json([
            'success' => true,
            'data' => new AnneeAcademiqueResource($anneeAcademique)
        ]);
    }

    /**
     * Update the specified année académique.
     */
    public function update(UpdateAnneeAcademiqueRequest $request, AnneeAcademique $anneeAcademique): JsonResponse
    {
        $anneeAcademique->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Année académique mise à jour avec succès.',
            'data' => new AnneeAcademiqueResource($anneeAcademique->fresh())
        ]);
    }

    /**
     * Remove the specified année académique (soft delete).
     */
    public function destroy(AnneeAcademique $anneeAcademique): JsonResponse
    {
        // Empêcher la suppression de l'année actuelle
        if ($anneeAcademique->est_actuelle) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer l\'année académique actuelle.'
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

        return response()->json([
            'success' => true,
            'message' => 'Année académique supprimée avec succès.'
        ]);
    }

    /**
     * Set an année académique as current.
     */
    public function setActuelle(AnneeAcademique $anneeAcademique): JsonResponse
    {
        // La logique dans le boot() du modèle va désactiver les autres automatiquement
        $anneeAcademique->update(['est_actuelle' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Année académique définie comme actuelle.',
            'data' => new AnneeAcademiqueResource($anneeAcademique)
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

        if ($request->has('with_offres')) {
            $annee->load('offresFormations.formation.mention.domaine');
        }

        return response()->json([
            'success' => true,
            'data' => new AnneeAcademiqueResource($annee)
        ]);
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

        // Empêcher la suppression de l'année actuelle
        if ($annee->est_actuelle) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer définitivement l\'année académique actuelle.'
            ], 422);
        }

        // Vérifier s'il y a des offres (même supprimées)
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
            'data' => \App\Http\Resources\OffreFormationResource::collection($offres)
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
}