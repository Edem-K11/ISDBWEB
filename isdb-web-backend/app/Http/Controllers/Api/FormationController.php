<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Http\Requests\StoreFormationRequest;
use App\Http\Requests\UpdateFormationRequest;
use App\Http\Resources\FormationResource;
use App\Http\Resources\FormationCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class FormationController extends Controller
{
    /**
     * Display a listing of formations.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Formation::query();

        // Eager loading
        $query->with([
            'mention.domaine',
            'offresFormations.anneeAcademique',
            'offreActuelle.anneeAcademique',
        ]);

        if ($request->has('with_offres')) {
            $query->with('offresFormations.anneeAcademique');
        }

        if ($request->has('with_offre_actuelle')) {
            $query->with('offreActuelle.anneeAcademique');
        }

        // Filtres
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('titre', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('specialite', 'LIKE', "%{$search}%");
            });
        }

        if ($request->has('type_formation')) {
            $type = strtoupper($request->input('type_formation'));
            if ($type === 'PRINCIPALE') {
                $query->principales();
            } elseif ($type === 'MODULAIRE') {
                $query->modulaires();
            }
        }

        if ($request->has('statut')) {
            $query->where('statut_formation', strtoupper($request->input('statut')));
        } else {
            // Par défaut, seulement les formations actives
            $query->actives();
        }

        if ($request->has('diplome')) {
            $query->parDiplome(strtoupper($request->input('diplome')));
        }

        if ($request->has('domaine_id')) {
            $query->parDomaine($request->input('domaine_id'));
        }

        if ($request->has('mention_id')) {
            $query->parMention($request->input('mention_id'));
        }

        // Tri
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        if ($request->has('per_page')) {
            $formations = $query->paginate($request->input('per_page', 15));
            return response()->json(new FormationCollection($formations));
        }

        $formations = $query->get();
        return response()->json([
            'success' => true,
            'data' => FormationResource::collection($formations),
            'meta' => [
                'total' => $formations->count(),
                'principales' => $formations->where('type_formation', 'PRINCIPALE')->count(),
                'modulaires' => $formations->where('type_formation', 'MODULAIRE')->count()
            ]
        ]);
    }

    /**
     * Store a newly created formation.
     */
    public function store(StoreFormationRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Gestion du fichier PDF
        if ($request->hasFile('programme_pdf')) {
            $path = $request->file('programme_pdf')->store('programmes', 'public');
            $data['programme_pdf'] = $path;
        }

        $formation = Formation::create($data);
        $formation->load('mention.domaine');

        return response()->json([
            'success' => true,
            'message' => 'Formation créée avec succès.',
            'data' => new FormationResource($formation)
        ], 201);
    }

    /**
     * Display the specified formation.
     */
    public function show(Request $request, Formation $formation): JsonResponse
    {
        $formation->load(['mention.domaine']);

        if ($request->has('with_offres')) {
            $formation->load('offresFormations.anneeAcademique');
        }

        if ($request->has('with_offre_actuelle')) {
            $formation->load('offreActuelle.anneeAcademique');
        }

        return response()->json([
            'success' => true,
            'data' => new FormationResource($formation)
        ]);
    }

    /**
     * Update the specified formation.
     */
    public function update(UpdateFormationRequest $request, Formation $formation): JsonResponse
    {
        $data = $request->validated();

        // Gestion du fichier PDF
        if ($request->hasFile('programme_pdf')) {
            // Supprimer l'ancien fichier si existe
            if ($formation->programme_pdf) {
                Storage::disk('public')->delete($formation->programme_pdf);
            }
            
            $path = $request->file('programme_pdf')->store('programmes', 'public');
            $data['programme_pdf'] = $path;
        }

        $formation->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation mise à jour avec succès.',
            'data' => new FormationResource($formation->fresh(['mention.domaine']))
        ]);
    }

    /**
     * Remove the specified formation (soft delete).
     */
    public function destroy(Formation $formation): JsonResponse
    {
        // Changer le statut à SUPPRIMEE
        $formation->update(['statut_formation' => Formation::STATUT_SUPPRIMEE]);
        $formation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Formation supprimée avec succès.'
        ]);
    }

    /**
     * Archive a formation.
     */
    public function archive(Formation $formation): JsonResponse
    {
        $formation->update(['statut_formation' => Formation::STATUT_ARCHIVEE]);

        return response()->json([
            'success' => true,
            'message' => 'Formation archivée avec succès.',
            'data' => new FormationResource($formation->fresh(['mention.domaine']))
        ]);
    }

    /**
     * Activate a formation.
     */
    public function activate(Formation $formation): JsonResponse
    {
        $formation->update(['statut_formation' => Formation::STATUT_ACTIVE]);

        return response()->json([
            'success' => true,
            'message' => 'Formation activée avec succès.',
            'data' => new FormationResource($formation->fresh(['mention.domaine']))
        ]);
    }

    /**
     * Restore a soft-deleted formation.
     */
    public function restore(int $id): JsonResponse
    {
        $formation = Formation::withTrashed()->findOrFail($id);
        
        if (!$formation->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette formation n\'est pas supprimée.'
            ], 422);
        }

        $formation->restore();
        $formation->update(['statut_formation' => Formation::STATUT_ACTIVE]);

        return response()->json([
            'success' => true,
            'message' => 'Formation restaurée avec succès.',
            'data' => new FormationResource($formation->load('mention.domaine'))
        ]);
    }

    /**
     * Permanently delete a formation.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $formation = Formation::withTrashed()->findOrFail($id);

        // Supprimer le fichier PDF si existe
        if ($formation->programme_pdf) {
            Storage::disk('public')->delete($formation->programme_pdf);
        }

        // Vérifier s'il y a des offres (même supprimées)
        if ($formation->offresFormations()->withTrashed()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer définitivement cette formation car elle a des offres de formation.'
            ], 422);
        }

        $formation->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Formation supprimée définitivement.'
        ]);
    }

    /**
     * Get all offres for a specific formation.
     */
    public function offres(Request $request, Formation $formation): JsonResponse
    {
        $query = $formation->offresFormations()->with('anneeAcademique');

        // Filtre pour année spécifique
        if ($request->has('annee_id')) {
            $query->where('annee_academique_id', $request->input('annee_id'));
        }

        // Seulement l'année actuelle
        if ($request->boolean('actuelle_only')) {
            $query->anneeActuelle();
        }

        // Seulement les offres dispensées
        if ($request->boolean('dispensees_only')) {
            $query->dispensees();
        }

        $offres = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => \App\Http\Resources\OffreFormationResource::collection($offres)
        ]);
    }

    /**
     * Get the current offer for a formation.
     */
    public function offreActuelle(Formation $formation): JsonResponse
    {
        $offre = $formation->offreActuelle()->with('anneeAcademique')->first();

        if (!$offre) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune offre pour l\'année académique actuelle.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new \App\Http\Resources\OffreFormationResource($offre)
        ]);
    }

    /**
     * Get statistics for a formation.
     */
    public function statistics(Formation $formation): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'nombre_offres' => $formation->offresFormations()->count(),
                'offres_dispensees' => $formation->offresFormations()
                    ->where('est_dispensee', true)
                    ->count(),
                'a_offre_actuelle' => $formation->offreActuelle()->exists(),
                'type' => $formation->type_formation,
                'statut' => $formation->statut_formation,
                'domaine' => $formation->mention?->domaine?->nom,
                'mention' => $formation->mention?->nom
            ]
        ]);
    }

    /**
     * Duplicate a formation.
     */
    public function duplicate(Formation $formation): JsonResponse
    {
        $newFormation = $formation->replicate();
        $newFormation->titre = $formation->titre . ' (Copie)';
        $newFormation->statut_formation = Formation::STATUT_ACTIVE;
        $newFormation->save();

        return response()->json([
            'success' => true,
            'message' => 'Formation dupliquée avec succès.',
            'data' => new FormationResource($newFormation->load('mention.domaine'))
        ], 201);
    }
}