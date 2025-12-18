<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Domaine;
use App\Models\Mention;

class MentionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les domaines
        $scienceTech = Domaine::where('nom', 'Sciences et Technologies')->first();
        $economieGestion = Domaine::where('nom', 'Économie et Gestion')->first();
        $sciencesHumaines = Domaine::where('nom', 'Sciences Humaines et Sociales')->first();

        $mentions = [
            // Sciences et Technologies
            [
                'titre' => 'Informatique',
                'description' => 'Formation en développement logiciel, réseaux, bases de données et intelligence artificielle.',
                'domaine_id' => $scienceTech->id,
            ],
            [
                'titre' => 'Génie Électrique et Automatisme',
                'description' => 'Formation en électrotechnique, automatisme industriel et systèmes embarqués.',
                'domaine_id' => $scienceTech->id,
            ],
            [
                'titre' => 'Mathématiques Appliquées',
                'description' => 'Formation en mathématiques, statistiques et modélisation.',
                'domaine_id' => $scienceTech->id,
            ],
            [
                'titre' => 'Génie Civil',
                'description' => 'Formation en construction, travaux publics et infrastructures.',
                'domaine_id' => $scienceTech->id,
            ],

            // Économie et Gestion
            [
                'titre' => 'Gestion des Entreprises',
                'description' => 'Formation en management, stratégie d\'entreprise et entrepreneuriat.',
                'domaine_id' => $economieGestion->id,
            ],
            [
                'titre' => 'Comptabilité et Finances',
                'description' => 'Formation en comptabilité, audit, contrôle de gestion et finances.',
                'domaine_id' => $economieGestion->id,
            ],
            [
                'titre' => 'Marketing et Communication',
                'description' => 'Formation en marketing digital, communication d\'entreprise et stratégie commerciale.',
                'domaine_id' => $economieGestion->id,
            ],
            [
                'titre' => 'Ressources Humaines',
                'description' => 'Formation en gestion du personnel, recrutement et développement RH.',
                'domaine_id' => $economieGestion->id,
            ],
            [
                'titre' => 'Économie et Développement',
                'description' => 'Formation en analyse économique, politiques publiques et développement durable.',
                'domaine_id' => $economieGestion->id,
            ],

            // Sciences Humaines et Sociales
            [
                'titre' => 'Droit',
                'description' => 'Formation en droit privé, droit public et droit des affaires.',
                'domaine_id' => $sciencesHumaines->id,
            ],
            [
                'titre' => 'Sociologie',
                'description' => 'Formation en analyse sociale, méthodes d\'enquête et sociologie appliquée.',
                'domaine_id' => $sciencesHumaines->id,
            ],
            [
                'titre' => 'Psychologie',
                'description' => 'Formation en psychologie clinique, du travail et développementale.',
                'domaine_id' => $sciencesHumaines->id,
            ],
            [
                'titre' => 'Communication et Journalisme',
                'description' => 'Formation en journalisme, communication médiatique et relations publiques.',
                'domaine_id' => $sciencesHumaines->id,
            ],
        ];

        foreach ($mentions as $mention) {
            Mention::create($mention);
        }

        $this->command->info('✅ 13 mentions créées');
    }
}