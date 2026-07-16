<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\Mention;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FormationSeeder extends Seeder
{
    public function run(): void
    {
        $philosophie = Mention::where('titre', 'Philosophie')->firstOrFail();
        $stc = Mention::where('titre', 'Sciences et Techniques de la Communication')->firstOrFail();
        $sciencesEducation = Mention::where('titre', 'Sciences de l\'Education')->firstOrFail();

        $formations = [
            // PHILOSOPHIE
            [
                'titre' => 'Licence Fondamentale en Sciences de l\'Homme et de la Société - Philosophie',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation en philosophie au sein des sciences de l\'homme et de la société.',
                'mention_id' => $philosophie->id,
                'diplome' => 'LICENCE_FONDAMENTALE',
                'duree_formation' => '6 semestres',
                'profile_intree' => 'Être titulaire du baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'condition_admission' => 'Être titulaire du baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'objectifs' => 'Maîtriser les fondamentaux de la philosophie, développer l\'esprit critique et la capacité d\'analyse.',
                'competences_visees' => 'Analyse philosophique, dissertation, argumentation, maîtrise des grands courants philosophiques.',
                'debouches' => 'Enseignement, recherche, conseil, administration publique, ONG.',
                'profile_sortie' => 'Philosophe capable d\'analyser et de théoriser les grands enjeux de la société.',
                'evaluation' => 'Examens écrits, dissertations, travaux de recherche.',
                'programme' => 'Métaphysique, épistémologie, éthique, histoire de la philosophie, logique, philosophie politique.',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Master Recherche en Philosophie Contemporaine',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Master recherche en philosophie contemporaine — formation pour la recherche et l\'enseignement supérieur.',
                'mention_id' => $philosophie->id,
                'diplome' => 'MASTER',
                'specialite' => 'Philosophie contemporaine',
                'duree_formation' => '4 semestres',
                'profile_intree' => 'Être titulaire d\'une licence en philosophie ou domaine connexe.',
                'condition_admission' => 'Licence en philosophie ou équivalent. Étude de dossier et entretien.',
                'objectifs' => 'Donner aux apprenants une formation de philosophie capable d\'aborder les questions et thématiques transversales de la philosophie contemporaine.',
                'objectif_specifique' => 'Développer des compétences de recherche philosophique et d\'analyse critique approfondie.',
                'competences_visees' => 'Recherche philosophique, rédaction scientifique, présentation de résultats, maîtrise des débats contemporains.',
                'debouches' => 'Enseignement supérieur, recherche, conseil expert, documentation.',
                'profile_sortie' => 'Chercheur et enseignant-chercheur en philosophie.',
                'evaluation' => 'Mémoire de recherche, séminaires, examens, colloques.',
                'programme' => 'Philosophie analytique, phénoménologie, herméneutique, philosophie continentale, thématiques contemporaines.',
                'statut_formation' => 'ACTIVE',
            ],

            // SCIENCES DE L'ÉDUCATION
            [
                'titre' => 'Licence Fondamentale en Sciences de l\'Education et de la Formation',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation en sciences de l\'éducation et de la formation — comprendre les processus d\'apprentissage.',
                'mention_id' => $sciencesEducation->id,
                'diplome' => 'LICENCE_FONDAMENTALE',
                'duree_formation' => '6 semestres',
                'profile_intree' => 'Être titulaire du baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'condition_admission' => 'Être titulaire du baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'objectifs' => 'Comprendre les processus d\'apprentissage, concevoir des dispositifs pédagogiques et analyser les systèmes éducatifs.',
                'competences_visees' => 'Psychologie de l\'apprentissage, conception pédagogique, gestion de classe, évaluation des apprentissages.',
                'debouches' => 'Enseignement, conseil pédagogique, administration scolaire, recherche en éducation, formation en entreprise.',
                'profile_sortie' => 'Professionnel de l\'éducation capable de concevoir et implémenter des dispositifs d\'apprentissage.',
                'evaluation' => 'Examens écrits, projets pédagogiques, mémoire.',
                'programme' => 'Psychologie de l\'éducation, didactique, sociologie de l\'éducation, gestion éducative, innovation pédagogique.',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Master Professionnel en Sciences de l\'Education',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Master professionnel en sciences de l\'éducation — conception, management et évaluation des projets et politiques en éducation.',
                'mention_id' => $sciencesEducation->id,
                'diplome' => 'MASTER',
                'specialite' => 'Conception, management et évaluation des projets et politiques en éducation',
                'duree_formation' => '4 semestres',
                'profile_intree' => 'Être titulaire d\'une licence en sciences de l\'éducation ou domaine connexe.',
                'condition_admission' => 'Licence en sciences de l\'éducation ou équivalent. Étude de dossier.',
                'objectifs' => 'Former une professionnalisation qui prépare aux différents métiers relevant du domaine de l\'éducation et de la formation. Former des praticiens capables de recherche-action.',
                'objectif_specifique' => 'Option 1 : conception et management des projets éducatifs. Option 2 : développement et évaluation du curriculum. Option 3 : analyse et gestion de systèmes éducatifs.',
                'competences_visees' => 'Management de projets, leadership éducatif, politiques éducatives, évaluation institutionnelle, recherche-action.',
                'debouches' => 'Cadre éducatif, gestionnaire de projets éducatifs, consultant en éducation, responsable formation.',
                'profile_sortie' => 'Manager et consultant en éducation capable de piloter des transformations éducatives.',
                'evaluation' => 'Projets professionnels, stage en milieu professionnel, mémoire.',
                'programme' => 'Management éducatif, politiques publiques, curriculum, évaluation, leadership, recherche en éducation.',
                'statut_formation' => 'ACTIVE',
            ],

            // COMMUNICATION
            [
                'titre' => 'Licence Professionnelle en Production et Réalisation Multimédia',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation professionnelle en production et réalisation multimédia — créer des contenus audiovisuels professionnels.',
                'mention_id' => $stc->id,
                'diplome' => 'LICENCE_PROFESSIONNELLE',
                'specialite' => 'Production et réalisation multimédia',
                'duree_formation' => '6 semestres',
                'profile_intree' => 'Être titulaire d\'un baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'condition_admission' => 'Être titulaire d\'un baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'objectifs' => 'Former des professionnels capables de concevoir et réaliser des contenus multimédias pour tous types de supports.',
                'objectif_specifique' => 'Maîtriser la production audiovisuelle, le montage, la post-production et la diffusion numérique.',
                'competences_visees' => 'Prise de vue, direction de production, montage vidéo, animation, effet spéciaux, gestion de projets multimédias.',
                'debouches' => 'Réalisateur, monteur, producteur audiovisuel, responsable contenu vidéo, designer multimedia.',
                'profile_sortie' => 'Réalisateur multimédia capable de produire des contenus de qualité professionnelle.',
                'evaluation' => 'Projets audiovisuels, portfolio professionnel, examens pratiques.',
                'programme' => 'Cinématographie, direction d\'acteurs, montage professionnel, VFX, color grading, gestion de production.',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Licence Professionnelle en Communication et Relations Publiques',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation professionnelle en communication et relations publiques — maîtriser l\'image et les relations institutionnelles.',
                'mention_id' => $stc->id,
                'diplome' => 'LICENCE_PROFESSIONNELLE',
                'specialite' => 'Communication et relations publiques',
                'duree_formation' => '6 semestres',
                'profile_intree' => 'Être titulaire d\'un baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'condition_admission' => 'Être titulaire d\'un baccalauréat toutes séries. Étude de dossier, suivie de test si besoin.',
                'objectifs' => 'Former des communicants capables de gérer l\'image et la relation publique des organisations.',
                'objectif_specifique' => 'Maîtriser la stratégie de communication, les relations presse et les campagnes institutionnelles.',
                'competences_visees' => 'Stratégie de communication, relations médias, community management, événementiel, crise management.',
                'debouches' => 'Chargé de communication, responsable relations publiques, consultant en communication, community manager.',
                'profile_sortie' => 'Communicant capable de piloter des stratégies de communication intégrées.',
                'evaluation' => 'Projets de communication, dossiers stratégiques, présentations, participation à événements.',
                'programme' => 'Stratégie marketing, relations presse, médias sociaux, communication de crise, événementiel, branding.',
                'statut_formation' => 'ACTIVE',
            ],
        ];

        foreach ($formations as $formation) {
            if (!isset($formation['slug'])) {
                $formation['slug'] = Str::slug($formation['titre']);
            }
            Formation::create($formation);
        }

        $this->command->info('✅ 6 formations principales créées avec succès');
    }
}
