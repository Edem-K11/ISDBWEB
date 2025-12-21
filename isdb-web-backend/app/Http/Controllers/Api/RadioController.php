<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Radio;
use App\Http\Requests\UpdateRadioRequest;
use App\Http\Resources\RadioResource;
use Illuminate\Http\JsonResponse;

class RadioController extends Controller
{
    /**
     * Get the radio (il n'y en a qu'une seule).
     */
    public function show(): JsonResponse
    {
        $radio = Radio::getRadio();

        if (!$radio) {
            return response()->json([
                'success' => false,
                'message' => 'Radio non configurée.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new RadioResource($radio),
        ]);
    }

    /**
     * Update the radio.
     */
    public function update(UpdateRadioRequest $request): JsonResponse
    {
        $radio = Radio::getRadio();

        if (!$radio) {
            return response()->json([
                'success' => false,
                'message' => 'Radio non configurée.',
            ], 404);
        }

        $radio->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Radio mise à jour avec succès.',
            'data' => new RadioResource($radio->fresh()),
        ]);
    }

    /**
     * Toggle radio live status.
     */
    public function toggleLive(): JsonResponse
    {
        $radio = Radio::getRadio();

        if (!$radio) {
            return response()->json([
                'success' => false,
                'message' => 'Radio non configurée.',
            ], 404);
        }

        $newStatus = !$radio->en_direct;
        $radio->update(['en_direct' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => $newStatus ? 'Radio mise en direct.' : 'Radio hors ligne.',
            'data' => new RadioResource($radio),
        ]);
    }
}