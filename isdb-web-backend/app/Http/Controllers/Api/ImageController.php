<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    /**
     * Upload une image
     * @param string $type - 'blogs' ou 'redacteurs' ou 'avatars'
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'type' => 'nullable|string|in:blogs,redacteurs,avatars', // Type d'image
        ]);

        try {
            $image = $request->file('image');
            $type = $request->input('type', 'blogs'); // Par défaut 'blogs'
            
            // Générer un nom unique
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            
            // Stocker dans le bon dossier selon le type
            $path = $image->storeAs($type, $filename, 'public');
            
            // Générer l'URL publique
            $url = Storage::url($path);
            
            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $path,
                'message' => 'Image uploadée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une image
     */
    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            if (Storage::disk('public')->exists($request->path)) {
                Storage::disk('public')->delete($request->path);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Image supprimée avec succès'
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Image non trouvée'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload multiple images (pour l'éditeur)
     */
    public function uploadMultiple(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'type' => 'nullable|string|in:blogs,redacteurs,avatars',
        ]);

        try {
            $type = $request->input('type', 'blogs');
            $uploadedImages = [];
            
            foreach ($request->file('images') as $image) {
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs($type, $filename, 'public');
                $url = Storage::url($path);
                
                $uploadedImages[] = [
                    'url' => $url,
                    'path' => $path
                ];
            }
            
            return response()->json([
                'success' => true,
                'images' => $uploadedImages,
                'message' => count($uploadedImages) . ' image(s) uploadée(s)'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }
}