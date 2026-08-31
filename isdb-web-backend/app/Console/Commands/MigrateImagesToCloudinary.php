<?php

namespace App\Console\Commands;

use App\Models\Blog;
use App\Models\Formation;
use App\Models\HomepageContent;
use App\Models\InstitutSetting;
use App\Models\Radio;
use App\Models\Redacteur;
use App\Models\Studio;
use Cloudinary\Cloudinary;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Migre vers Cloudinary toutes les images actuellement servies depuis le
 * stockage local (storage/app/public) et met à jour chaque enregistrement en
 * base avec sa nouvelle URL Cloudinary. Ne touche jamais une valeur déjà
 * externe (ui-avatars.com, unsplash.com...) ni une valeur déjà migrée — donc
 * sûr à relancer plusieurs fois.
 *
 * Ne supprime jamais les fichiers locaux d'origine : une fois la migration
 * vérifiée, ils peuvent être nettoyés manuellement dans storage/app/public.
 */
class MigrateImagesToCloudinary extends Command
{
    protected $signature = 'cloudinary:migrate-images {--dry-run : Lister ce qui serait migré, sans rien envoyer sur Cloudinary ni modifier la base}';

    protected $description = 'Migre vers Cloudinary les images encore stockées localement (avatars, logos, couvertures de blog, etc.)';

    private int $migrated = 0;

    private int $skipped = 0;

    private int $failed = 0;

    public function handle(Cloudinary $cloudinary): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if ($dryRun) {
            $this->warn('Mode simulation (--dry-run) : rien n\'est envoyé sur Cloudinary, rien n\'est modifié en base.');
        }

        $this->line('Rédacteurs (avatar)...');
        Redacteur::whereNotNull('avatar')->get()->each(
            fn (Redacteur $r) => $this->migrateField($r, 'avatar', 'redacteurs', $cloudinary, $dryRun)
        );

        $this->line('Blogs (cover_image)...');
        Blog::whereNotNull('cover_image')->get()->each(
            fn (Blog $b) => $this->migrateField($b, 'cover_image', 'blogs', $cloudinary, $dryRun)
        );

        $this->line('Radio (image)...');
        Radio::whereNotNull('image')->get()->each(
            fn (Radio $r) => $this->migrateField($r, 'image', 'radio', $cloudinary, $dryRun)
        );

        $this->line('Formations (programme_image)...');
        Formation::whereNotNull('programme_image')->get()->each(
            fn (Formation $f) => $this->migrateField($f, 'programme_image', 'formations', $cloudinary, $dryRun)
        );

        $this->line('Page d\'accueil, contenu éditorial (hero_image)...');
        HomepageContent::whereNotNull('hero_image')->get()->each(
            fn (HomepageContent $h) => $this->migrateField($h, 'hero_image', 'homepage', $cloudinary, $dryRun)
        );

        $this->line('Institut (logo + galerie)...');
        $institut = InstitutSetting::first();
        if ($institut) {
            $this->migrateField($institut, 'logo', 'institut', $cloudinary, $dryRun);
            $this->migrateArrayField($institut, 'galerie', 'institut', $cloudinary, $dryRun);
        }

        $this->line('Studios (images)...');
        Studio::all()->each(
            fn (Studio $s) => $this->migrateArrayField($s, 'images', 'studios', $cloudinary, $dryRun)
        );

        $this->newLine();
        $this->info("Migrées : {$this->migrated}  |  Ignorées (déjà externes/déjà migrées) : {$this->skipped}  |  Échecs : {$this->failed}");

        return self::SUCCESS;
    }

    /**
     * Migre un champ "chemin unique" (avatar, cover_image, image, logo...).
     */
    private function migrateField(Model $model, string $field, string $folder, Cloudinary $cloudinary, bool $dryRun): void
    {
        $value = $model->{$field};
        $label = $model->getTable().'#'.$model->getKey().'.'.$field;
        $newUrl = $this->migrateOne($value, $folder, $cloudinary, $dryRun, $label);

        if ($newUrl !== null && ! $dryRun) {
            $model->update([$field => $newUrl]);
        }
    }

    /**
     * Migre un champ tableau (galerie[], images[]).
     */
    private function migrateArrayField(Model $model, string $field, string $folder, Cloudinary $cloudinary, bool $dryRun): void
    {
        $values = $model->{$field} ?? [];
        if (empty($values)) {
            return;
        }

        $changed = false;
        $newValues = [];

        foreach ($values as $index => $value) {
            $label = $model->getTable().'#'.$model->getKey().'.'.$field.'['.$index.']';
            $newUrl = $this->migrateOne($value, $folder, $cloudinary, $dryRun, $label);
            $newValues[] = $newUrl ?? $value;
            if ($newUrl !== null) {
                $changed = true;
            }
        }

        if ($changed && ! $dryRun) {
            $model->update([$field => $newValues]);
        }
    }

    /**
     * Migre une URL individuelle si elle pointe vers le stockage local
     * (.../storage/...). Renvoie la nouvelle URL Cloudinary, ou null si rien
     * n'a été migré (valeur vide, déjà externe, fichier introuvable, échec).
     */
    private function migrateOne(?string $value, string $folder, Cloudinary $cloudinary, bool $dryRun, string $label): ?string
    {
        if (! $value) {
            return null;
        }

        // Déjà externe (ui-avatars.com, unsplash.com...) ou déjà migré vers
        // Cloudinary lors d'un précédent passage : on n'y touche pas.
        if (! str_contains($value, '/storage/')) {
            $this->skipped++;

            return null;
        }

        $relativePath = Str::after($value, '/storage/');
        $localPath = storage_path('app/public/'.$relativePath);

        if (! is_file($localPath)) {
            $this->error("  ✗ {$label} : fichier introuvable ({$relativePath})");
            $this->failed++;

            return null;
        }

        if ($dryRun) {
            $this->line("  → {$label} : {$relativePath}");
            $this->migrated++;

            return null;
        }

        try {
            // On garde le même identifiant (uuid) que le nom de fichier local,
            // juste réorganisé sous le même dossier logique que côté local —
            // trace facilement de quel fichier chaque asset Cloudinary provient.
            $publicId = $folder.'/'.pathinfo($relativePath, PATHINFO_FILENAME);

            $result = $cloudinary->uploadApi()->upload($localPath, [
                'public_id' => $publicId,
                'resource_type' => 'image',
                'overwrite' => true,
            ]);

            $this->info("  ✓ {$label} → {$result['secure_url']}");
            $this->migrated++;

            return $result['secure_url'];
        } catch (\Throwable $e) {
            $this->error("  ✗ {$label} : {$e->getMessage()}");
            $this->failed++;

            return null;
        }
    }
}
