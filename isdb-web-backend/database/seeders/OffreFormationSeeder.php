<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;
use App\Models\AnneeAcademique;
use App\Models\OffreFormation;

class OffreFormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les formations
        $formations = Formation::all();
        
        // Récupérer les années académiques
        $annee2024 = AnneeAcademique::where('annee_debut', 2024)->first();
        $annee2023 = AnneeAcademique::where('annee_debut', 2023)->first();
        $annee2025 = AnneeAcademique::where('annee_debut', 2025)->first();

        // Chefs de parcours fictifs
        $chefsParcours = [
            'Dr. Kofi Mensah',
            'Pr. Aminata Diallo',
            'Dr. Jean-Baptiste Kouassi',
            'Pr. Marie-Claire Assogba',
            'Dr. Ibrahim Touré',
            'Pr. Sophie N\'Guessan',
            'Dr. Pierre Adom',
            'Pr. Fatou Sow',
        ];

        // Animateurs pour formations modulaires
        $animateurs = [
            'M. Alexandre Dubois',
            'Mme. Nathalie Bernard',
            'M. Yves Koné',
            'Mme. Christine Appiah',
        ];

        $counter = 0;

        foreach ($formations as $formation) {
            $isModulaire = $formation->type_formation === 'MODULAIRE';
            
            // Créer des offres pour l'année 2023-2024 (passée)
            if (!$isModulaire) {
                OffreFormation::create([
                    'formation_id' => $formation->id,
                    'annee_academique_id' => $annee2023->id,
                    'chef_parcours' => $chefsParcours[array_rand($chefsParcours)],
                    'animateur' => null,
                    'date_debut' => '2023-10-15',
                    'date_fin' => '2024-07-15',
                    'place_limited' => rand(30, 60),
                    'prix' => null,
                    'est_dispensee' => true,
                ]);
                $counter++;
            }

            // Créer des offres pour l'année 2024-2025 (actuelle)
            if ($isModulaire) {
                // Formations modulaires : une seule offre par année
                // (plusieurs sessions = même formation mais dates différentes)
                $moisDebut = rand(10, 12); // Entre octobre et décembre 2024
                $dateDebut = "2024-{$moisDebut}-" . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);
                
                // Durée selon le type de formation
                $dureeJours = match($formation->titre) {
                    'Formation Intensive en Design Thinking' => 3,
                    'Initiation à la Cybersécurité' => 5,
                    'Gestion de Projet Agile (Scrum)' => 2,
                    'Excel Avancé pour Professionnels' => 3,
                    default => 5
                };

                $dateFin = date('Y-m-d', strtotime($dateDebut . " +{$dureeJours} days"));

                OffreFormation::create([
                    'formation_id' => $formation->id,
                    'annee_academique_id' => $annee2024->id,
                    'chef_parcours' => null,
                    'animateur' => $animateurs[array_rand($animateurs)],
                    'date_debut' => $dateDebut,
                    'date_fin' => $dateFin,
                    'place_limited' => rand(15, 30),
                    'prix' => rand(50000, 200000), // Prix en FCFA
                    'est_dispensee' => true,
                ]);
                $counter++;
            } else {
                // Formations principales : une offre par an
                OffreFormation::create([
                    'formation_id' => $formation->id,
                    'annee_academique_id' => $annee2024->id,
                    'chef_parcours' => $chefsParcours[array_rand($chefsParcours)],
                    'animateur' => null,
                    'date_debut' => '2024-10-01',
                    'date_fin' => match($formation->diplome) {
                        'LICENCE_PROFESSIONNELLE' => '2025-09-30',
                        'LICENCE_FONDAMENTALE' => '2027-09-30', // 3 ans
                        'MASTER' => '2026-09-30', // 2 ans
                        default => '2025-09-30'
                    },
                    'place_limited' => match($formation->diplome) {
                        'LICENCE_PROFESSIONNELLE' => rand(30, 45),
                        'LICENCE_FONDAMENTALE' => rand(50, 80),
                        'MASTER' => rand(20, 35),
                        default => 40
                    },
                    'prix' => null, // Prix non défini pour formations principales
                    'est_dispensee' => true,
                ]);
                $counter++;
            }

            // Créer des offres pour l'année 2025-2026 (future) - seulement quelques formations
            if (!$isModulaire && rand(0, 1)) {
                OffreFormation::create([
                    'formation_id' => $formation->id,
                    'annee_academique_id' => $annee2025->id,
                    'chef_parcours' => $chefsParcours[array_rand($chefsParcours)],
                    'animateur' => null,
                    'date_debut' => '2025-10-01',
                    'date_fin' => match($formation->diplome) {
                        'LICENCE_PROFESSIONNELLE' => '2026-09-30',
                        'LICENCE_FONDAMENTALE' => '2028-09-30',
                        'MASTER' => '2027-09-30',
                        default => '2026-09-30'
                    },
                    'place_limited' => rand(30, 60),
                    'prix' => null,
                    'est_dispensee' => false, // Pas encore confirmée
                ]);
                $counter++;
            }
        }

        $this->command->info("✅ {$counter} offres de formation créées sur plusieurs années académiques");
    }
}