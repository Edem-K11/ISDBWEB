<?php

namespace Database\Seeders;

use App\Models\FormationModulaire;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FormationModulaireSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            [
                'titre' => 'Production et Réalisation d\'un Reportage',
                'description' => 'Maîtrisez les techniques de production et réalisation de reportages professionnels.',
                'contenu' => 'Prise de vue - Prise de son - Montage - Rédaction',
                'duree_heures' => 72,
                'frais_inscription' => 10000,
                'frais_formation' => 100000,
                'condition_admission' => 'Niveau baccalauréat ou équivalent',
                'objectifs' => 'Acquérir les compétences pratiques en production audiovisuelle et réalisation de reportages professionnels.',
                'competences_visees' => 'Prise de vue professionnelle, prise de son, montage vidéo, rédaction de scripts',
                'debouches' => 'Producteur audiovisuel, réalisateur de documentaires, journaliste audiovisuel',
                'profile_sortie' => 'Capable de produire et réaliser des reportages de qualité professionnelle',
                'evaluation' => 'Projets pratiques, examens écrits, évaluation continue',
                'programme' => 'Techniques de caméra, éclairage, son directionnel, montage non-linéaire, écriture audiovisuelle',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Photographie, Infographie et Community Management',
                'description' => 'Développez vos compétences en photographie professionnelle et gestion des réseaux sociaux.',
                'contenu' => 'Technique de prise de photo professionnelle - photographie & marketing - création graphique et web (photoshop) - Rédaction de contenu - les outils du community management',
                'duree_heures' => 144,
                'frais_inscription' => 10000,
                'frais_formation' => 200000,
                'condition_admission' => 'Niveau baccalauréat ou équivalent',
                'objectifs' => 'Maîtriser la photographie professionnelle, la conception graphique et la gestion des communautés en ligne.',
                'competences_visees' => 'Photographie numérique, retouche photo, design graphique, stratégie social media, création de contenu',
                'debouches' => 'Photographe professionnel, community manager, designer graphique, responsable réseaux sociaux',
                'profile_sortie' => 'Expert en visual content et gestion de présence numérique',
                'evaluation' => 'Portfolio de projets, gestion de compte social média simulé, examens pratiques',
                'programme' => 'Composition photographique, éclairage studio, Adobe Creative Suite, stratégie marketing digital, engagement metrics',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Création Musicale',
                'description' => 'Explorez les techniques de composition et production musicale en studio.',
                'contenu' => 'Composition musicale et studio - Programmation musicale et prise de son - Mixage - Mastering',
                'duree_heures' => 192,
                'frais_inscription' => 10000,
                'frais_formation' => 200000,
                'condition_admission' => 'Notions musicales de base recommandées',
                'objectifs' => 'Maîtriser la composition, production et post-production musicale en environnement professionnel.',
                'competences_visees' => 'Composition musicale, arrangement, programmation MIDI, enregistrement, mixage, mastering',
                'debouches' => 'Compositeur, producteur musical, ingénieur du son, sound designer',
                'profile_sortie' => 'Producteur musical capable de composer, enregistrer et mixer des œuvres professionnelles',
                'evaluation' => 'Projets musicaux originaux, démonstration de techniques de studio, evaluation d\'écoute',
                'programme' => 'Théorie musicale appliquée, DAW (Logic Pro/Ableton), synthèse sonore, acoustique studio, chaîne de mastering',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Animation Radio / TV',
                'description' => 'Devenez animateur radio et télévision professionnel avec les techniques de prise de parole.',
                'contenu' => 'Prise de parole en public - Voix off - Rédaction de conducteur - Technique d\'animation radio / TV',
                'duree_heures' => 144,
                'frais_inscription' => 10000,
                'frais_formation' => 200000,
                'condition_admission' => 'Passion pour les médias audiovisuels requise',
                'objectifs' => 'Développer les compétences d\'animation pour la radio et la télévision avec maîtrise des techniques vocales.',
                'competences_visees' => 'Prise de parole dynamique, voix off professionnelle, rédaction de conducteurs, improvisation, gestion du temps d\'antenne',
                'debouches' => 'Animateur radio, présentateur TV, producteur audiovisuel, formateur en communication',
                'profile_sortie' => 'Animateur capable de créer du contenu engageant en direct ou en enregistrement',
                'evaluation' => 'Performances en direct, portfolios de voix off, création de conducteurs, évaluation de présence médiatique',
                'programme' => 'Techniques vocales, diction, modulation, gestion du direct, rédaction broadcast, mise en scène audiovisuelle',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Journalisme',
                'description' => 'Formez-vous aux métiers du journalisme moderne incluant le journalisme vidéo et numérique.',
                'contenu' => 'Technique de rédaction - Art oratoire - Technique d\'argumentation et de persuasion - Vidéo journalisme - Cyber journalisme - Technique de présentation TV',
                'duree_heures' => 192,
                'frais_inscription' => 10000,
                'frais_formation' => 300000,
                'condition_admission' => 'Intérêt pour l\'actualité et excellente maîtrise de la langue',
                'objectifs' => 'Former des journalistes polyvalents maîtrisant les formats traditionnels et numériques.',
                'competences_visees' => 'Rédaction journalistique, reportage vidéo, fact-checking, journalisme d\'investigation, présentation médiatique, gestion de sources',
                'debouches' => 'Journaliste reporter, présentateur de journal télé, journaliste web, éditorialiste, producteur de contenu',
                'profile_sortie' => 'Journaliste multimédia capable de couvrir l\'actualité sur tous les formats',
                'evaluation' => 'Articles publiés, reportages vidéo, portfolios numériques, examens de culture générale et actu',
                'programme' => 'Droit de la presse, déontologie journalistique, recherche d\'information, interview, montage reportage, présentation',
                'statut_formation' => 'ACTIVE',
            ],
        ];

        foreach ($modules as $module) {
            if (!isset($module['slug'])) {
                $module['slug'] = Str::slug($module['titre']);
            }
            FormationModulaire::create($module);
        }

        $this->command->info('✅ 5 formations modulaires créées avec succès');
    }
}
