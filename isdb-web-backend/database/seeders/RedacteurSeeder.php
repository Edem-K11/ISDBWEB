<?php

namespace Database\Seeders;

use App\Models\Redacteur;
use Illuminate\Database\Seeder;

class RedacteurSeeder extends Seeder
{
    public function run(): void
    {
        $redacteurs = [
            [
                'nom' => 'David WOTTOR',
                'email' => 'david.wottor@example.com',
                'avatar' => 'https://ui-avatars.com/api/?name=David+WOTTOR',
                'bio' => 'Rédacteur passionné par l\'éducation et la philosophie.',
            ],
            [
                'nom' => 'Marie DUBOIS',
                'email' => 'marie.dubois@example.com',
                'avatar' => 'https://ui-avatars.com/api/?name=Marie+DUBOIS',
                'bio' => 'Spécialiste en technologie et innovation.',
            ],
        ];

        foreach ($redacteurs as $redacteur) {
            Redacteur::create($redacteur);
        }
    }
}
