<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHomepageContentRequest;
use App\Http\Resources\HomepageContentResource;
use App\Models\HomepageContent;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    public function show(): JsonResponse
    {
        $content = HomepageContent::getContent();

        return response()->json([
            'success' => true,
            'data' => new HomepageContentResource($content),
        ]);
    }

    public function update(UpdateHomepageContentRequest $request): JsonResponse
    {
        $content = HomepageContent::getContent();
        $content->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Page d\'accueil mise à jour avec succès.',
            'data' => new HomepageContentResource($content->fresh()),
        ]);
    }
}
