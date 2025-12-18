<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mention;
use App\Http\Requests\StoreMentionRequest;
use App\Http\Requests\UpdateMentionRequest;
use App\Http\Resources\MentionResource;
use App\Http\Resources\MentionCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MentionController extends Controller
{
    /**
     * Display a listing of mentions.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Mention::query();

        // Eager loading
        if ($request->has('with_domaine')) {
            $query->with('domaine');
        }

        if ($request->has('with_formations')) {
            $query->with('formations');
        }

        // Filtres
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('titre', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
        }

        if ($request->has('domaine_id')) {
            $query->parDomaine($request->input('domaine_id'));
        }

        // Filtre pour les mentions ayant des formations actives
        if ($request->boolean('has_active_formations')) {
            $query->avecFormationsActives();
        }

        // Tri
        $sortBy = $request->input('sort_by', 'titre');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        if ($request->has('per_page')) {
            $mentions = $query->paginate($request->input('per_page', 15));
            return response()->json(new MentionCollection($mentions));
        }

        $mentions = $query->get();
        return response()->json([
            'success' => true,
            'data' => MentionResource::collection($mentions),
            'meta' => [
                'total' => $mentions->count()
            ]
        ]);
    }

    /**
     * Store a newly created mention.
     */
    public function store(StoreMentionRequest $request): JsonResponse
    {
        $mention = Mention::create($request->validated());
        $mention->load('domaine');

        return response()->json([
            'success' => true,
            'message' => 'Mention créée avec succès.',
            'data' => new MentionResource($mention)
        ], 201);
    }

    /**
     * Display the specified mention.
     */
    public function show(Request $request, Mention $mention): JsonResponse
    {
        // Eager loading conditionnel
        if ($request->has('with_domaine')) {
            $mention->load('domaine');
        }

        if ($request->has('with_formations')) {
            $mention->load('formations');
        }

        return response()->json([
            'success' => true,
            'data' => new MentionResource($mention)
        ]);
    }

    /**
     * Update the specified mention.
     */
    public function update(UpdateMentionRequest $request, Mention $mention): JsonResponse
    {
        $mention->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Mention mise à jour avec succès.',
            'data' => new MentionResource($mention->fresh('domaine'))
        ]);
    }

    /**
     * Remove the specified mention (soft delete).
     */
    public function destroy(Mention $mention): JsonResponse
    {
        // Vérifier s'il y a des formations associées
        if ($mention->formations()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette mention car elle contient des formations.'
            ], 422);
        }

        $mention->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mention supprimée avec succès.'
        ]);
    }

    /**
     * Restore a soft-deleted mention.
     */
    public function restore(int $id): JsonResponse
    {
        $mention = Mention::withTrashed()->findOrFail($id);
        
        if (!$mention->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette mention n\'est pas supprimée.'
            ], 422);
        }

        $mention->restore();

        return response()->json([
            'success' => true,
            'message' => 'Mention restaurée avec succès.',
            'data' => new MentionResource($mention->load('domaine'))
        ]);
    }

    /**
     * Permanently delete a mention.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $mention = Mention::withTrashed()->findOrFail($id);

        // Vérifier s'il y a des formations (même supprimées)
        if ($mention->formations()->withTrashed()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer définitivement cette mention car elle contient des formations.'
            ], 422);
        }

        $mention->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Mention supprimée définitivement.'
        ]);
    }

    /**
     * Get all formations for a specific mention.
     */
    public function formations(Request $request, Mention $mention): JsonResponse
    {
        $query = $mention->formations();

        // Filtres
        if ($request->has('statut')) {
            $query->where('statut_formation', $request->input('statut'));
        }

        if ($request->has('diplome')) {
            $query->where('diplome', $request->input('diplome'));
        }

        // Seulement les formations actives par défaut
        if (!$request->has('include_archived')) {
            $query->where('statut_formation', 'ACTIVE');
        }

        $formations = $query->with('offreActuelle')->get();

        return response()->json([
            'success' => true,
            'data' => \App\Http\Resources\FormationResource::collection($formations)
        ]);
    }

    /**
     * Get statistics for a mention.
     */
    public function statistics(Mention $mention): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'nombre_formations' => $mention->formations()->count(),
                'formations_actives' => $mention->formations()
                    ->where('statut_formation', 'ACTIVE')
                    ->count(),
                'formations_par_diplome' => $mention->formations()
                    ->selectRaw('diplome, COUNT(*) as total')
                    ->groupBy('diplome')
                    ->get(),
                'domaine' => $mention->domaine?->nom
            ]
        ]);
    }
}