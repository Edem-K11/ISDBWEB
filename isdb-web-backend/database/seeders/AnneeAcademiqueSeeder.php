<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnneeAcademique;

class AnneeAcademiqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $annees = [
            [
                'annee_debut' => 2022,
                'annee_fin' => 2023,
                'date_debut' => '2022-10-01',
                'date_fin' => '2023-09-30',
                'est_actuelle' => false,
            ],
            [
                'annee_debut' => 2023,
                'annee_fin' => 2024,
                'date_debut' => '2023-10-01',
                'date_fin' => '2024-09-30',
                'est_actuelle' => false,
            ],
            [
                'annee_debut' => 2024,
                'annee_fin' => 2025,
                'date_debut' => '2024-10-01',
                'date_fin' => '2025-09-30',
                'est_actuelle' => true, // Année actuelle
            ],
            [
                'annee_debut' => 2025,
                'annee_fin' => 2026,
                'date_debut' => '2025-10-01',
                'date_fin' => '2026-09-30',
                'est_actuelle' => false,
            ],
        ];

        foreach ($annees as $annee) {
            AnneeAcademique::create($annee);
        }

        $this->command->info('✅ 4 années académiques créées (2024-2025 est l\'année actuelle)');
    }
}