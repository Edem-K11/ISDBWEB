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
        // Note : `est_actuelle` n'est pas mass-assignable (et ne doit pas l'être, sous peine
        // de devenir obsolète avec le temps). Elle est recalculée dynamiquement ci-dessous
        // à partir de la date du jour, comme le fait le contrôleur après chaque écriture.
        $annees = [
            [
                'annee_debut' => 2023,
                'annee_fin' => 2024,
                'date_debut' => '2023-10-01',
                'date_fin' => '2024-09-30',
            ],
            [
                'annee_debut' => 2024,
                'annee_fin' => 2025,
                'date_debut' => '2024-10-01',
                'date_fin' => '2025-09-30',
            ],
            [
                'annee_debut' => 2025,
                'annee_fin' => 2026,
                'date_debut' => '2025-10-01',
                'date_fin' => '2026-09-30',
            ],
            [
                'annee_debut' => 2026,
                'annee_fin' => 2027,
                'date_debut' => '2026-10-01',
                'date_fin' => '2027-09-30',
            ],
        ];

        foreach ($annees as $annee) {
            AnneeAcademique::create($annee);
        }

        AnneeAcademique::recalculerAnneeActuelle();

        $this->command->info('✅ 4 années académiques créées (année actuelle recalculée d\'après la date du jour)');
    }
}