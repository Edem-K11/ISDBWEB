<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Domaine;

class DomaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $domaines = [
            [
                'nom' => 'Sciences et Technologies',
            ],
            [
                'nom' => 'Économie et Gestion',
            ],
            [
                'nom' => 'Sciences Humaines et Sociales',
            ],
        ];

        foreach ($domaines as $domaine) {
            Domaine::create($domaine);
        }

        $this->command->info('✅ 3 domaines créés');
    }
}