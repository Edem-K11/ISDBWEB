<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationModulaire;
use App\Http\Requests\StoreFormationModulaireRequest;
use App\Http\Requests\UpdateFormationModulaireRequest;
use App\Http\Resources\FormationModulaireResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class FormationModulaireController extends Controller
{
    public function index(): JsonResponse
    {
        $formations = FormationModulaire::actives()->orderBy('titre')->get();

        return response()->json([
            'success' => true,
            'data' => FormationModulaireResource::collection($formations),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $formation = FormationModulaire::where('slug', $slug)
            ->where('statut_formation', 'ACTIVE')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => new FormationModulaireResource($formation),
        ]);
    }

    /**
     * Liste des formations modulaires pour le dashboard (tous statuts, filtrable).
     */
    public function indexDashboard(Request $request): JsonResponse
    {
        $query = FormationModulaire::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if ($request->has('statut')) {
            $query->where('statut_formation', strtoupper($request->input('statut')));
        } else {
            $query->where('statut_formation', FormationModulaire::STATUT_ACTIVE);
        }

        $formations = $query->orderBy('titre')->get();

        return response()->json([
            'success' => true,
            'data' => FormationModulaireResource::collection($formations),
        ]);
    }

    /**
     * Détail d'une formation modulaire pour le dashboard (par id, tous statuts).
     */
    public function showAdmin(FormationModulaire $formationModulaire): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new FormationModulaireResource($formationModulaire),
        ]);
    }

    public function store(StoreFormationModulaireRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('programme_pdf')) {
            $data['programme_pdf'] = $request->file('programme_pdf')->store('programmes', 'public');
        }

        $formation = FormationModulaire::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire créée avec succès.',
            'data' => new FormationModulaireResource($formation),
        ], 201);
    }

    public function update(UpdateFormationModulaireRequest $request, FormationModulaire $formationModulaire): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('programme_pdf')) {
            if ($formationModulaire->programme_pdf) {
                Storage::disk('public')->delete($formationModulaire->programme_pdf);
            }
            $data['programme_pdf'] = $request->file('programme_pdf')->store('programmes', 'public');
        }

        $formationModulaire->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire mise à jour avec succès.',
            'data' => new FormationModulaireResource($formationModulaire->fresh()),
        ]);
    }

    /**
     * Supprime (soft delete) la formation modulaire. Réservé à une vraie
     * suppression — ce n'est PAS l'action déclenchée par le bouton "Archiver"
     * du dashboard, qui utilise archive() ci-dessous.
     */
    public function destroy(FormationModulaire $formationModulaire): JsonResponse
    {
        // Le slug reste unique en base même après soft delete (la ligne existe
        // toujours physiquement) : on le libère ici pour qu'un titre identique
        // puisse être recréé plus tard sans provoquer une erreur d'unicité.
        $formationModulaire->update([
            'statut_formation' => FormationModulaire::STATUT_SUPPRIMEE,
            'slug' => $formationModulaire->slug . '-supprime-' . $formationModulaire->id,
        ]);
        $formationModulaire->delete();

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire supprimée avec succès.',
        ]);
    }

    /**
     * Archive la formation modulaire : change uniquement son statut, sans
     * soft delete — elle reste normalement consultable/listable dans le
     * dashboard (juste masquée du site public), contrairement à destroy().
     */
    public function archive(FormationModulaire $formationModulaire): JsonResponse
    {
        $formationModulaire->update(['statut_formation' => FormationModulaire::STATUT_ARCHIVEE]);

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire archivée avec succès.',
            'data' => new FormationModulaireResource($formationModulaire->fresh()),
        ]);
    }

    /**
     * Réactive une formation modulaire archivée.
     */
    public function activate(FormationModulaire $formationModulaire): JsonResponse
    {
        $formationModulaire->update(['statut_formation' => FormationModulaire::STATUT_ACTIVE]);

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire réactivée avec succès.',
            'data' => new FormationModulaireResource($formationModulaire->fresh()),
        ]);
    }

    /**
     * Liste des formations modulaires soft-supprimées, pour la vue Corbeille.
     */
    public function trashed(): JsonResponse
    {
        $formations = FormationModulaire::onlyTrashed()->orderBy('deleted_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => FormationModulaireResource::collection($formations),
        ]);
    }

    /**
     * Restore une formation modulaire soft-supprimée.
     */
    public function restore(int $id): JsonResponse
    {
        $formation = FormationModulaire::withTrashed()->findOrFail($id);

        if (!$formation->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette formation modulaire n\'est pas supprimée.',
            ], 422);
        }

        $formation->restore();
        $formation->update(['statut_formation' => FormationModulaire::STATUT_ACTIVE]);

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire restaurée avec succès.',
            'data' => new FormationModulaireResource($formation->fresh()),
        ]);
    }

    /**
     * Supprime définitivement une formation modulaire.
     */
    public function forceDelete(int $id): JsonResponse
    {
        $formation = FormationModulaire::withTrashed()->findOrFail($id);

        if ($formation->programme_pdf) {
            Storage::disk('public')->delete($formation->programme_pdf);
        }

        $formation->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Formation modulaire supprimée définitivement.',
        ]);
    }
}
