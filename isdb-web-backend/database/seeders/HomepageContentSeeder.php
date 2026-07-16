<?php

namespace Database\Seeders;

use App\Models\HomepageContent;
use Illuminate\Database\Seeder;

class HomepageContentSeeder extends Seeder
{
    public function run(): void
    {
        HomepageContent::query()->delete();
        HomepageContent::create(HomepageContent::defaults());

        $this->command->info('✅ Contenu de la page d\'accueil créé');
    }
}
