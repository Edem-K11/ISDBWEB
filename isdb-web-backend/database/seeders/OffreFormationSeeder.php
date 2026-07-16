<?php

namespace Database\Seeders;

use App\Models\AnneeAcademique;
use App\Models\Formation;
use App\Models\OffreFormation;
use Illuminate\Database\Seeder;

class OffreFormationSeeder extends Seeder
{
    public function run(): void
    {
        $anneeActuelle = AnneeAcademique::where('est_actuelle', true)->firstOrFail();

        $offresPrincipales = [
            'Licence Fondamentale en Sciences de l\'Homme et de la Société' => [
                'chef_parcours' => 'M. Bantchin NAPAKOU (Maître de conférences)',
            ],
            'Licence Fondamentale en Sciences de l\'Education et de la Formation' => [
                'chef_parcours' => 'M. Bahama BAOUTOU (Maître de conférences)',
            ],
            'Licence Professionnelle en Production et Réalisation Multimédia' => [
                'chef_parcours' => 'Dr Afiwa Pépé KPAKPO',
            ],
            'Licence Professionnelle en Communication et Relations Publiques' => [
                'chef_parcours' => 'Dr Afiwa Pépé KPAKPO',
            ],
            'Master Recherche en Philosophie' => [
                'chef_parcours' => 'Pr Bilina Iba BALLONG',
            ],
            'Master Professionnel en Sciences de l\'Education' => [
                'chef_parcours' => 'Pr Cyrique Sena AKAKPO-NUMADO',
            ],
        ];

        foreach ($offresPrincipales as $titre => $data) {
            $formation = Formation::where('titre', $titre)->firstOrFail();

            OffreFormation::create([
                'formation_id' => $formation->id,
                'annee_academique_id' => $anneeActuelle->id,
                'chef_parcours' => $data['chef_parcours'],
                'est_dispensee' => true,
            ]);
        }

        $offresModulaires = [
            'Production et réalisation d\'un reportage' => [
                'frais_inscription' => 10000,
                'prix' => 100000,
            ],
            'Photographie, infographie et community management' => [
                'frais_inscription' => 10000,
                'prix' => 200000,
            ],
            'Création musicale' => [
                'frais_inscription' => 10000,
                'prix' => 200000,
            ],
            'Animation radio / TV' => [
                'frais_inscription' => 10000,
                'prix' => 200000,
            ],
            'Journalisme' => [
                'frais_inscription' => 10000,
                'prix' => 300000,
            ],
        ];

        foreach ($offresModulaires as $titre => $data) {
            $formation = Formation::where('titre', $titre)->firstOrFail();

            OffreFormation::create([
                'formation_id' => $formation->id,
                'annee_academique_id' => $anneeActuelle->id,
                'frais_inscription' => $data['frais_inscription'],
                'prix' => $data['prix'],
                'est_dispensee' => true,
            ]);
        }

        $this->command->info('✅ Offres de formation créées');
    }
}
