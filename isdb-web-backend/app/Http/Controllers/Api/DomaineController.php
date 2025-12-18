<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use App\Http\Requests\StoreDomaineRequest;
use App\Http\Requests\UpdateDomaineRequest;
use App\Http\Resources\DomaineResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DomaineController extends Controller
{
    /**
     * Display a listing of domaines.
     */
    public function index(Request $request): JsonResponse
    {
        // Eager load des relations pour avoir nombreMentions et nombreFormations
        $domaines = Domaine::withCount(['mentions', 'formations'])
            ->with('mentions') // Charger les mentions si besoin
            ->get();

        return response()->json([
            'success' => true,
            'data' => DomaineResource::collection($domaines),
            'meta' => [
                'total' => $domaines->count(),
            ]
        ]);
    }

    /**
     * Store a newly created domaine.
     */
    public function store(StoreDomaineRequest $request): JsonResponse
    {
        $domaine = Domaine::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Domaine créé avec succès.',
            'data' => new DomaineResource($domaine)
        ], 201);
    }

    /**
     * Display the specified domaine.
     */
    public function show(Request $request, Domaine $domaine): JsonResponse
    {
        // Eager loading conditionnel
        if ($request->has('with_mentions')) {
            $domaine->load('mentions');
        }

        if ($request->has('with_formations')) {
            $domaine->load('formations');
        }

        return response()->json([
            'success' => true,
            'data' => new DomaineResource($domaine)
        ]);
    }

    /**
     * Update the specified domaine.
     */
    public function update(UpdateDomaineRequest $request, Domaine $domaine): JsonResponse
    {
        $domaine->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Domaine mis à jour avec succès.',
            'data' => new DomaineResource($domaine->fresh())
        ]);
    }

    /**
     * Remove the specified domaine (soft delete).
     */
    public function destroy(Domaine $domaine): JsonResponse
    {
        // Vérifier s'il y a des mentions associées
        if ($domaine->mentions()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce domaine car il contient des mentions.'
            ], 422);
        }

        $domaine->delete();

        return response()->json([
            'success' => true,
            'message' => 'Domaine supprimé avec succès.'
        ]);
    }

    /**
     * Restore a soft-deleted domaine.
     */
    public function restore(int $id): JsonResponse
    {
        $domaine = Domaine::withTrashed()->findOrFail($id);
        
        if (!$domaine->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Ce domaine n\'est pas supprimé.'
            ], 422);
        }

        $domaine->restore();

        return response()->json([
            'success' => true,
            'message' => 'Domaine restauré avec succès.',
            'data' => new DomaineResource($domaine)
        ]);
    }

    /**
     * Permanently delete a domaine.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $domaine = Domaine::withTrashed()->findOrFail($id);

        // Vérifier s'il y a des mentions (même supprimées)
        if ($domaine->mentions()->withTrashed()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer définitivement ce domaine car il contient des mentions.'
            ], 422);
        }

        $domaine->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Domaine supprimé définitivement.'
        ]);
    }

    /**
     * Get all mentions for a specific domaine.
     */
    public function mentions(Domaine $domaine): JsonResponse
    {
        $mentions = $domaine->mentions()->with('formations')->get();

        return response()->json([
            'success' => true,
            'data' => \App\Http\Resources\MentionResource::collection($mentions)
        ]);
    }

    /**
     * Get all formations for a specific domaine.
     */
    public function formations(Request $request, Domaine $domaine): JsonResponse
    {
        $query = $domaine->formations();

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

        $formations = $query->with(['mention', 'offreActuelle'])->get();

        return response()->json([
            'success' => true,
            'data' => \App\Http\Resources\FormationResource::collection($formations)
        ]);
    }

    /**
     * Get statistics for a domaine.
     */
    public function statistics(Domaine $domaine): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'nombre_mentions' => $domaine->mentions()->count(),
                'nombre_formations' => $domaine->formations()->count(),
                'formations_actives' => $domaine->formations()
                    ->where('statut_formation', 'ACTIVE')
                    ->count(),
                'formations_principales' => $domaine->formations()
                    ->where('type_formation', 'PRINCIPALE')
                    ->count(),
                'formations_par_diplome' => $domaine->formations()
                    ->selectRaw('diplome, COUNT(*) as total')
                    ->groupBy('diplome')
                    ->get()
            ]
        ]);
    }
}