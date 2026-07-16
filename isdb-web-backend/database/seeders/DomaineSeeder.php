<?php

namespace Database\Seeders;

use App\Models\Domaine;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DomaineSeeder extends Seeder
{
    public function run(): void
    {
        $domaines = [
            ['nom' => 'Sciences de l\'Homme et de la Société'],
            ['nom' => 'Sciences de l\'Education et de la Formation'],
        ];

        foreach ($domaines as $domaine) {
            $domaine['slug'] = Str::slug($domaine['nom']);
            Domaine::create($domaine);
        }

        $this->command->info('✅ 2 domaines créés');
    }
}
