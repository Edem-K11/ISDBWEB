<?php

namespace Database\Seeders;

use App\Models\Studio;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudioSeeder extends Seeder
{
    public function run(): void
    {
        $studios = [
            [
                'nom' => 'Studio Vidéo François de Sales',
                'slug' => 'studio-video-francois-de-sales',
                'description' => 'Le studio François de SALES est un espace de production vidéo comprenant une station de post-production et un plateau télé. Les étudiants y apprennent des techniques de réalisation vidéo. Le studio vidéo est aussi ouvert au grand public pour la réalisation d\'émission, film, master-class ou autre besoin en réalisation vidéo.',
                'images' => [],
                'ordre' => 1,
                'lien_radio' => false,
                'est_actif' => true,
            ],
            [
                'nom' => 'Studio Alain FOKA',
                'slug' => 'studio-alain-foka',
                'description' => 'Le studio Alain FOKA porte la web Radio de l\'Institut Supérieur Don Bosco. Les émissions y sont préparées et diffusées sur le net. Les étudiants sont initiés aux métiers de la radio dès la première année.',
                'images' => [],
                'ordre' => 2,
                'lien_radio' => true,
                'est_actif' => true,
            ],
            [
                'nom' => 'Studio d\'enregistrement Manu DIBANGO',
                'slug' => 'studio-enregistrement-manu-dibango',
                'description' => 'Le studio d\'enregistrement Manu DIBANGO est un espace d\'apprentissage pour étudiants en communication. Les méthodes d\'enregistrement y sont enseignées. La formation est basée sur la pratique. Le studio est également ouvert au grand public pour des enregistrements professionnels.',
                'images' => [],
                'ordre' => 3,
                'lien_radio' => false,
                'est_actif' => true,
            ],
        ];

        foreach ($studios as $studio) {
            Studio::create($studio);
        }

        $this->command->info('✅ 3 studios créés');
    }
}
