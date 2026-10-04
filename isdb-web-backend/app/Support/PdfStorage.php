<?php

namespace App\Support;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

// Les programmes PDF sont stockés sur Cloudinary (et non sur le disque du serveur,
// effacé à chaque redéploiement sur l'hébergement gratuit). Le champ en base
// contient l'URL complète du fichier.
class PdfStorage
{
    public function __construct(private Cloudinary $cloudinary)
    {
    }

    public function store(UploadedFile $fichier): string
    {
        // Pour un fichier "raw", Cloudinary conserve l'extension dans l'identifiant.
        $resultat = $this->cloudinary->uploadApi()->upload($fichier->getRealPath(), [
            'public_id' => 'programmes/'.Str::uuid().'.pdf',
            'resource_type' => 'raw',
        ]);

        return $resultat['secure_url'];
    }

    public function delete(?string $url): void
    {
        if (! $url || ! str_contains($url, 'res.cloudinary.com')) {
            return;
        }

        if (! preg_match('#/raw/upload/(?:v\d+/)?(.+)$#', $url, $correspondance)) {
            return;
        }

        $this->cloudinary->uploadApi()->destroy($correspondance[1], ['resource_type' => 'raw']);
    }

    // Anciens enregistrements : chemin local relatif. Les nouveaux sont déjà des URL complètes.
    public static function publicUrl(?string $valeur): ?string
    {
        if (! $valeur) {
            return null;
        }

        return str_starts_with($valeur, 'http') ? $valeur : url('storage/'.$valeur);
    }
}
