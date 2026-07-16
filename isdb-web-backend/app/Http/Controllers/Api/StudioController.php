<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudioRequest;
use App\Http\Requests\UpdateStudioRequest;
use App\Http\Resources\StudioResource;
use App\Models\Studio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudioController extends Controller
{
    public function indexPublic(): JsonResponse
    {
        $studios = Studio::actifs()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => StudioResource::collection($studios),
        ]);
    }

    public function showPublic(string $slug): JsonResponse
    {
        $studio = Studio::actifs()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => new StudioResource($studio),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $studios = Studio::ordered()->get();

        return response()->json([
            'success' => true,
            'data' => StudioResource::collection($studios),
        ]);
    }

    public function store(StoreStudioRequest $request): JsonResponse
    {
        $studio = Studio::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Studio créé avec succès.',
            'data' => new StudioResource($studio),
        ], 201);
    }

    public function show(Studio $studio): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new StudioResource($studio),
        ]);
    }

    public function update(UpdateStudioRequest $request, Studio $studio): JsonResponse
    {
        $studio->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Studio mis à jour avec succès.',
            'data' => new StudioResource($studio->fresh()),
        ]);
    }

    public function destroy(Studio $studio): JsonResponse
    {
        $studio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Studio supprimé avec succès.',
        ]);
    }
}
