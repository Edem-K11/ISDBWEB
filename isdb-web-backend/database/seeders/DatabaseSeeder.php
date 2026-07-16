<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            DomaineSeeder::class,
            MentionSeeder::class,
            AnneeAcademiqueSeeder::class,
            FormationSeeder::class,
            FormationModulaireSeeder::class,
            // OffreFormationSeeder::class, // Disabled - model lookup fails
            StudioSeeder::class,
            HomepageContentSeeder::class,
            RedacteurSeeder::class,
            TagSeeder::class,
            BlogSeeder::class,
            MentionPageContentSeeder::class,
        ]);
        
        $this->command->info('✅ Base de données peuplée avec succès !');

    }
}
