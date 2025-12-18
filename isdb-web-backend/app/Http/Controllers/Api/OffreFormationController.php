<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OffreFormation;
use App\Http\Requests\StoreOffreFormationRequest;
use App\Http\Requests\UpdateOffreFormationRequest;
use App\Http\Resources\OffreFormationResource;
use App\Http\Resources\OffreFormationCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OffreFormationController extends Controller
{
    /**
     * Display a listing of offres de formation.
     */
    public function index(Request $request): JsonResponse
    {
        $query = OffreFormation::query();

        // Eager loading
        $query->with(['formation.mention.domaine', 'anneeAcademique']);

        // Filtres
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('formation', function($q) use ($search) {
                $q->where('titre', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Filtre par formation
        if ($request->has('formation_id')) {
            $query->parFormation($request->input('formation_id'));
        }

        // Filtre par année académique
        if ($request->has('annee_academique_id')) {
            $query->parAnnee($request->input('annee_academique_id'));
        }

        // Seulement l'année actuelle
        if ($request->boolean('annee_actuelle')) {
            $query->anneeActuelle();
        }

        // Type de formation
        if ($request->has('type_formation')) {
            if ($request->input('type_formation') === 'PRINCIPALE') {
                $query->formationsPrincipales();
            } elseif ($request->input('type_formation') === 'MODULAIRE') {
                $query->formationsModulaires();
            }
        }

        // Seulement les offres dispensées
        if ($request->boolean('dispensees_only')) {
            $query->dispensees();
        }

        // Offres avec places disponibles
        if ($request->boolean('places_disponibles')) {
            $query->avecPlacesDisponibles();
        }

        // Filtre par domaine
        if ($request->has('domaine_id')) {
            $query->whereHas('formation.mention', function($q) use ($request) {
                $q->where('domaine_id', $request->input('domaine_id'));
            });
        }

        // Filtre par mention
        if ($request->has('mention_id')) {
            $query->whereHas('formation', function($q) use ($request) {
                $q->where('mention_id', $request->input('mention_id'));
            });
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        if (in_array($sortBy, ['date_debut', 'date_fin', 'prix', 'place_limited'])) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', $sortOrder);
        }

        // Pagination
        if ($request->has('per_page')) {
            $offres = $query->paginate($request->input('per_page', 15));
            return response()->json(new OffreFormationCollection($offres));
        }

        $offres = $query->get();
        return response()->json([
            'success' => true,
            'data' => OffreFormationResource::collection($offres),
            'meta' => [
                'total' => $offres->count(),
                'dispensees' => $offres->where('est_dispensee', true)->count(),
                'avec_places_limitees' => $offres->whereNotNull('place_limited')->count()
            ]
        ]);
    }

    /**
     * Store a newly created offre de formation.
     */
    public function store(StoreOffreFormationRequest $request): JsonResponse
    {
        $offre = OffreFormation::create($request->validated());
        $offre->load(['formation.mention.domaine', 'anneeAcademique']);

        return response()->json([
            'success' => true,
            'message' => 'Offre de formation créée avec succès.',
            'data' => new OffreFormationResource($offre)
        ], 201);
    }

    /**
     * Display the specified offre de formation.
     */
    public function show(OffreFormation $offreFormation): JsonResponse
    {
        $offreFormation->load(['formation.mention.domaine', 'anneeAcademique']);

        return response()->json([
            'success' => true,
            'data' => new OffreFormationResource($offreFormation)
        ]);
    }

    /**
     * Update the specified offre de formation.
     */
    public function update(UpdateOffreFormationRequest $request, OffreFormation $offreFormation): JsonResponse
    {
        $offreFormation->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Offre de formation mise à jour avec succès.',
            'data' => new OffreFormationResource($offreFormation->fresh(['formation.mention.domaine', 'anneeAcademique']))
        ]);
    }

    /**
     * Remove the specified offre de formation (soft delete).
     */
    public function destroy(OffreFormation $offreFormation): JsonResponse
    {
        $offreFormation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Offre de formation supprimée avec succès.'
        ]);
    }

    /**
     * Toggle dispensée status.
     */
    public function toggleDispensee(OffreFormation $offreFormation): JsonResponse
    {
        $offreFormation->update([
            'est_dispensee' => !$offreFormation->est_dispensee
        ]);

        $status = $offreFormation->est_dispensee ? 'activée' : 'désactivée';

        return response()->json([
            'success' => true,
            'message' => "Offre de formation {$status} avec succès.",
            'data' => new OffreFormationResource($offreFormation->fresh(['formation.mention.domaine', 'anneeAcademique']))
        ]);
    }

    /**
     * Restore a soft-deleted offre de formation.
     */
    public function restore(int $id): JsonResponse
    {
        $offre = OffreFormation::withTrashed()->findOrFail($id);
        
        if (!$offre->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette offre de formation n\'est pas supprimée.'
            ], 422);
        }

        $offre->restore();

        return response()->json([
            'success' => true,
            'message' => 'Offre de formation restaurée avec succès.',
            'data' => new OffreFormationResource($offre->load(['formation.mention.domaine', 'anneeAcademique']))
        ]);
    }

    /**
     * Permanently delete an offre de formation.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $offre = OffreFormation::withTrashed()->findOrFail($id);
        $offre->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Offre de formation supprimée définitivement.'
        ]);
    }

    /**
     * Get offres for current academic year (public endpoint).
     */
    public function actuelles(Request $request): JsonResponse
    {
        $query = OffreFormation::anneeActuelle()
            ->dispensees()
            ->with(['formation.mention.domaine', 'anneeAcademique']);

        // Filtres publics
        if ($request->has('type_formation')) {
            if ($request->input('type_formation') === 'PRINCIPALE') {
                $query->formationsPrincipales();
            } elseif ($request->input('type_formation') === 'MODULAIRE') {
                $query->formationsModulaires();
            }
        }

        if ($request->has('domaine_id')) {
            $query->whereHas('formation.mention', function($q) use ($request) {
                $q->where('domaine_id', $request->input('domaine_id'));
            });
        }

        if ($request->has('diplome')) {
            $query->whereHas('formation', function($q) use ($request) {
                $q->where('diplome', $request->input('diplome'));
            });
        }

        $offres = $query->get();

        return response()->json([
            'success' => true,
            'data' => OffreFormationResource::collection($offres),
            'meta' => [
                'annee_academique' => $offres->first()?->anneeAcademique?->libelle,
                'total' => $offres->count()
            ]
        ]);
    }

    /**
     * Get statistics for an offre de formation.
     */
    public function statistics(OffreFormation $offreFormation): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'formation' => $offreFormation->formation->titre,
                'annee' => $offreFormation->anneeAcademique->libelle,
                'est_dispensee' => $offreFormation->est_dispensee,
                'est_en_cours' => $offreFormation->est_en_cours,
                'est_future' => $offreFormation->est_future,
                'est_passee' => $offreFormation->est_passee,
                'a_places_disponibles' => $offreFormation->a_places_disponibles,
                'places_restantes' => $offreFormation->place_limited,
                'prix' => $offreFormation->prix,
                'duree_jours' => $offreFormation->date_debut && $offreFormation->date_fin 
                    ? $offreFormation->date_debut->diffInDays($offreFormation->date_fin) 
                    : null
            ]
        ]);
    }

    /**
     * Duplicate an offre de formation for another year.
     */
    public function duplicate(Request $request, OffreFormation $offreFormation): JsonResponse
    {
        $request->validate([
            'annee_academique_id' => 'required|integer|exists:annees_academiques,id'
        ]);

        // Vérifier qu'une offre n'existe pas déjà
        $exists = OffreFormation::where('formation_id', $offreFormation->formation_id)
            ->where('annee_academique_id', $request->annee_academique_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Cette formation est déjà offerte pour cette année académique.'
            ], 422);
        }

        $newOffre = $offreFormation->replicate();
        $newOffre->annee_academique_id = $request->annee_academique_id;
        $newOffre->save();

        return response()->json([
            'success' => true,
            'message' => 'Offre de formation dupliquée avec succès.',
            'data' => new OffreFormationResource($newOffre->load(['formation.mention.domaine', 'anneeAcademique']))
        ], 201);
    }
}