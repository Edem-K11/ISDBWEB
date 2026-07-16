<?php

namespace Database\Seeders;

use App\Models\Domaine;
use App\Models\Mention;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MentionSeeder extends Seeder
{
    public function run(): void
    {
        $sciencesHomme = Domaine::where('nom', 'Sciences de l\'Homme et de la Société')->firstOrFail();
        $sciencesEducation = Domaine::where('nom', 'Sciences de l\'Education et de la Formation')->firstOrFail();

        $mentions = [
            [
                'titre' => 'Philosophie',
                'description' => 'Formation en philosophie, pensée critique et questions fondamentales de l\'existence humaine.',
                'domaine_id' => $sciencesHomme->id,
            ],
            [
                'titre' => 'Sciences et Techniques de la Communication',
                'description' => 'Formation en communication, médias, production audiovisuelle et relations publiques.',
                'domaine_id' => $sciencesHomme->id,
            ],
            [
                'titre' => 'Sciences de l\'Education',
                'description' => 'Formation en sciences de l\'éducation, pédagogie et gestion des systèmes éducatifs.',
                'domaine_id' => $sciencesEducation->id,
            ],
        ];

        foreach ($mentions as $mention) {
            $mention['slug'] = Str::slug($mention['titre']);
            Mention::create($mention);
        }

        $this->command->info('✅ 3 mentions créées');
    }
}
