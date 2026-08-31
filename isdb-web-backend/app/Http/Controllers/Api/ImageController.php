<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    private const ALLOWED_TYPES = 'blogs,redacteurs,avatars,radio,institut,studios';

    /**
     * Upload une image vers Cloudinary.
     * @param string $type - dossier logique : 'blogs', 'redacteurs', 'avatars', 'radio', 'institut' ou 'studios'
     */
    public function upload(Request $request, Cloudinary $cloudinary)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'type' => 'nullable|string|in:'.self::ALLOWED_TYPES,
        ]);

        try {
            $image = $request->file('image');
            $type = $request->input('type', 'blogs'); // Par défaut 'blogs'

            $result = $this->uploadToCloudinary($image, $type, $cloudinary);

            return response()->json([
                'success' => true,
                'url' => $result['secure_url'],
                'path' => $result['public_id'],
                'message' => 'Image uploadée avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer une image sur Cloudinary, identifiée par son public_id
     * (le champ "path" renvoyé par upload()/uploadMultiple()).
     */
    public function delete(Request $request, Cloudinary $cloudinary)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        try {
            $result = $cloudinary->uploadApi()->destroy($request->path, ['resource_type' => 'image']);

            if (in_array($result['result'], ['ok', 'not found'], true)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Image supprimée avec succès',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Image non trouvée',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload multiple images vers Cloudinary (pour l'éditeur).
     */
    public function uploadMultiple(Request $request, Cloudinary $cloudinary)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'type' => 'nullable|string|in:'.self::ALLOWED_TYPES,
        ]);

        try {
            $type = $request->input('type', 'blogs');
            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                $result = $this->uploadToCloudinary($image, $type, $cloudinary);

                $uploadedImages[] = [
                    'url' => $result['secure_url'],
                    'path' => $result['public_id'],
                ];
            }

            return response()->json([
                'success' => true,
                'images' => $uploadedImages,
                'message' => count($uploadedImages).' image(s) uploadée(s)',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Envoie un fichier vers Cloudinary, rangé dans le dossier logique
     * correspondant à son type ("blogs", "avatars"...), sous un identifiant
     * unique — on passe directement par le SDK Cloudinary plutôt que par la
     * façade Storage : ça évite un aller-retour d'API supplémentaire pour
     * récupérer l'URL (déjà présente dans la réponse d'upload), et ça
     * contourne une limite du package cloudinary-labs/cloudinary-laravel qui
     * ne gère correctement que les images/vidéos via Storage::url() (les
     * fichiers "raw" comme un PDF perdent leur extension et deviennent
     * introuvables — voir programme_pdf, volontairement laissé en stockage
     * local pour cette raison).
     */
    private function uploadToCloudinary(UploadedFile $image, string $type, Cloudinary $cloudinary)
    {
        $publicId = $type.'/'.Str::uuid();

        return $cloudinary->uploadApi()->upload($image->getRealPath(), [
            'public_id' => $publicId,
            'resource_type' => 'image',
        ]);
    }
}
