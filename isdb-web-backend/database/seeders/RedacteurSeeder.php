<?php

namespace Database\Seeders;

use App\Models\Redacteur;
use Illuminate\Database\Seeder;

class RedacteurSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        Redacteur::create([
            'nom' => 'Admin ISDB',
            'email' => 'admin@test.com',
            'password' => bcrypt('admin'),
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+ISDB&background=FF6B6B&color=fff',
            'bio' => 'Administrateur du système ISDB',
            'role' => 'admin',
            'est_actif' => true,
        ]);

        $redacteurs = [
            [
                'nom' => 'David WOTTOR',
                'email' => 'david.wottor@example.com',
                'password' => bcrypt('password'), // Mot de passe par défaut
                'avatar' => 'https://ui-avatars.com/api/?name=David+WOTTOR',
                'bio' => 'Rédacteur passionné par l\'éducation et la philosophie.',
                'role' => 'redacteur',
                'est_actif' => true,
            ],
            [
                'nom' => 'Marie DUBOIS',
                'email' => 'marie.dubois@example.com',
                'password' => bcrypt('password'), // Mot de passe par défaut
                'avatar' => 'https://ui-avatars.com/api/?name=Marie+DUBOIS',
                'bio' => 'Spécialiste en technologie et innovation.',
                'role' => 'redacteur',
                'est_actif' => true,
            ],
        ];

        foreach ($redacteurs as $redacteur) {
            Redacteur::create($redacteur);
        }
    }
}
