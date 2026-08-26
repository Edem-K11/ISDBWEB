<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::create([
            ...$request->validated(),
            'lu' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
            'data' => new ContactMessageResource($message),
        ], 201);
    }

    public function index(): JsonResponse
    {
        $messages = ContactMessage::recent()->get();

        return response()->json([
            'success' => true,
            'data' => ContactMessageResource::collection($messages),
        ]);
    }

    public function show(ContactMessage $message): JsonResponse
    {
        if (! $message->lu) {
            $message->update(['lu' => true]);
        }

        return response()->json([
            'success' => true,
            'data' => new ContactMessageResource($message),
        ]);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé avec succès.',
        ]);
    }
}
