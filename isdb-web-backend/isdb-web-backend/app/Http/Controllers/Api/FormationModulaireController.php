<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormationModulaire;
use App\Http\Resources\FormationModulaireResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
