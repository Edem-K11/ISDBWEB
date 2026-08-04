<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateInstitutSettingRequest;
use App\Http\Resources\InstitutSettingResource;
use App\Models\InstitutSetting;
use Illuminate\Http\JsonResponse;

class InstitutSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = InstitutSetting::getSettings();

        return response()->json([
            'success' => true,
            'data' => new InstitutSettingResource($settings),
        ]);
    }

    public function update(UpdateInstitutSettingRequest $request): JsonResponse
    {
        $settings = InstitutSetting::getSettings();
        $settings->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Informations de l\'institut mises à jour avec succès.',
            'data' => new InstitutSettingResource($settings->fresh()),
        ]);
    }
}
