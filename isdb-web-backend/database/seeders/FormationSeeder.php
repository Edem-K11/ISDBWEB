<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mention;
use App\Models\Formation;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les mentions
        $informatique = Mention::where('titre', 'Informatique')->first();
        $genieElec = Mention::where('titre', 'Génie Électrique et Automatisme')->first();
        $gestionEntreprise = Mention::where('titre', 'Gestion des Entreprises')->first();
        $compta = Mention::where('titre', 'Comptabilité et Finances')->first();
        $marketing = Mention::where('titre', 'Marketing et Communication')->first();
        $droit = Mention::where('titre', 'Droit')->first();
        $sociologie = Mention::where('titre', 'Sociologie')->first();

        $formations = [
            // FORMATIONS PRINCIPALES - Informatique
            [
                'titre' => 'Licence Professionnelle en Développement Web et Mobile',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation intensive en développement d\'applications web modernes et applications mobiles multiplateformes.',
                'mention_id' => $informatique->id,
                'diplome' => 'LICENCE_PROFESSIONNELLE',
                'condition_admission' => 'Bac+2 en informatique ou équivalent. Connaissances en programmation requises.',
                'profile_intree' => 'Étudiants titulaires d\'un DUT, BTS ou L2 en informatique avec bases solides en programmation.',
                'specialite' => 'Développement Full Stack, Applications Mobiles',
                'objectifs' => 'Former des développeurs capables de concevoir et réaliser des applications web et mobiles performantes. Maîtriser les frameworks modernes (React, Angular, React Native, Flutter). Comprendre les architectures client-serveur et les APIs RESTful.',
                'profile_sortie' => 'Développeur Full Stack, Développeur Mobile, Ingénieur logiciel junior',
                'evaluation' => 'Contrôle continu (40%), Projets pratiques (30%), Examen final (30%)',
                'programme' => 'Semestre 1: HTML/CSS/JavaScript avancé, React.js, Node.js, Bases de données. Semestre 2: React Native/Flutter, DevOps, Sécurité web, Projet professionnel.',
                'duree_formation' => '1 an',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Licence Fondamentale en Informatique',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation généraliste en informatique couvrant les aspects théoriques et pratiques.',
                'mention_id' => $informatique->id,
                'diplome' => 'LICENCE_FONDAMENTALE',
                'condition_admission' => 'Baccalauréat série C, D ou équivalent avec mention.',
                'profile_intree' => 'Bacheliers scientifiques avec de bonnes bases en mathématiques et logique.',
                'specialite' => 'Informatique générale',
                'objectifs' => 'Acquérir les fondamentaux de l\'informatique: algorithmique, structures de données, systèmes d\'exploitation, réseaux, bases de données. Développer la pensée algorithmique et les capacités de résolution de problèmes.',
                'profile_sortie' => 'Poursuivre en Master, Technicien informatique, Assistant développeur',
                'evaluation' => 'Contrôle continu (50%), Examens semestriels (50%)',
                'programme' => 'L1: Introduction à l\'informatique, Algorithmique, Mathématiques. L2: Programmation orientée objet, Structures de données, Bases de données. L3: Réseaux, Systèmes, Génie logiciel, Projet.',
                'duree_formation' => '3 ans',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Master en Intelligence Artificielle et Data Science',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation avancée en IA, Machine Learning et analyse de données massives.',
                'mention_id' => $informatique->id,
                'diplome' => 'MASTER',
                'condition_admission' => 'Licence en informatique, mathématiques ou domaine connexe. Bonnes connaissances en programmation Python et mathématiques.',
                'profile_intree' => 'Diplômés en informatique ou mathématiques avec bases solides en programmation et statistiques.',
                'specialite' => 'Intelligence Artificielle, Machine Learning, Data Science',
                'objectifs' => 'Former des experts en IA capables de concevoir des systèmes intelligents. Maîtriser les techniques de Machine Learning et Deep Learning. Analyser et exploiter les données massives (Big Data).',
                'profile_sortie' => 'Data Scientist, Ingénieur IA, Chercheur en ML, Consultant Data',
                'evaluation' => 'Projets de recherche (40%), Mémoire (30%), Examens (30%)',
                'programme' => 'M1: Machine Learning, Deep Learning, Big Data, Statistiques avancées. M2: Computer Vision, NLP, Reinforcement Learning, Projet de recherche.',
                'duree_formation' => '2 ans',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],

            // FORMATIONS PRINCIPALES - Génie Électrique
            [
                'titre' => 'Licence Professionnelle en Automatisme Industriel',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation en systèmes automatisés et contrôle industriel.',
                'mention_id' => $genieElec->id,
                'diplome' => 'LICENCE_PROFESSIONNELLE',
                'condition_admission' => 'Bac+2 en électrotechnique, automatisme ou équivalent.',
                'profile_intree' => 'Techniciens ayant des bases en électricité et automatisme.',
                'specialite' => 'Automatisme, Supervision industrielle',
                'objectifs' => 'Former des techniciens supérieurs en automatisme industriel. Maîtriser les automates programmables (PLC). Concevoir et maintenir des systèmes automatisés.',
                'profile_sortie' => 'Technicien en automatisme, Superviseur de production',
                'evaluation' => 'TP et projets (60%), Examens (40%)',
                'programme' => 'Automates programmables, SCADA, Réseaux industriels, Maintenance préventive.',
                'duree_formation' => '1 an',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],

            // FORMATIONS PRINCIPALES - Gestion
            [
                'titre' => 'Licence Professionnelle en Management des Organisations',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation en management d\'équipe et gestion d\'entreprise.',
                'mention_id' => $gestionEntreprise->id,
                'diplome' => 'LICENCE_PROFESSIONNELLE',
                'condition_admission' => 'Bac+2 en gestion, commerce ou équivalent.',
                'profile_intree' => 'Étudiants ou professionnels souhaitant acquérir des compétences managériales.',
                'specialite' => 'Management, Leadership',
                'objectifs' => 'Développer les compétences en management d\'équipe. Comprendre les stratégies organisationnelles. Maîtriser les outils de gestion de projet.',
                'profile_sortie' => 'Manager d\'équipe, Chef de projet, Entrepreneur',
                'evaluation' => 'Études de cas (50%), Projet entrepreneurial (30%), Examen (20%)',
                'programme' => 'Leadership, Gestion de projet, Stratégie d\'entreprise, GRH, Marketing.',
                'duree_formation' => '1 an',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Master en Finance et Contrôle de Gestion',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation avancée en finance d\'entreprise et pilotage financier.',
                'mention_id' => $compta->id,
                'diplome' => 'MASTER',
                'condition_admission' => 'Licence en gestion, finance, comptabilité ou économie.',
                'profile_intree' => 'Diplômés en gestion avec bases solides en comptabilité et finance.',
                'specialite' => 'Finance d\'entreprise, Audit, Contrôle',
                'objectifs' => 'Former des experts en pilotage financier. Maîtriser les techniques d\'audit et de contrôle. Analyser les performances financières des organisations.',
                'profile_sortie' => 'Contrôleur de gestion, Auditeur, Directeur financier',
                'evaluation' => 'Études de cas (40%), Mémoire professionnel (35%), Examens (25%)',
                'programme' => 'Contrôle de gestion avancé, Audit interne, Finance de marché, Normes IFRS.',
                'duree_formation' => '2 ans',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],

            // FORMATIONS PRINCIPALES - Marketing
            [
                'titre' => 'Licence Professionnelle en Marketing Digital',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation spécialisée en stratégies marketing digitales et e-commerce.',
                'mention_id' => $marketing->id,
                'diplome' => 'LICENCE_PROFESSIONNELLE',
                'condition_admission' => 'Bac+2 en marketing, communication ou gestion commerciale.',
                'profile_intree' => 'Étudiants passionnés par le digital et les nouvelles technologies marketing.',
                'specialite' => 'Marketing digital, E-commerce, Social Media',
                'objectifs' => 'Maîtriser les outils du marketing digital (SEO, SEA, Social Media). Concevoir et piloter des campagnes digitales. Analyser les données web (Google Analytics).',
                'profile_sortie' => 'Chef de projet digital, Community Manager, Traffic Manager',
                'evaluation' => 'Projets digitaux (50%), Examens (30%), Stage (20%)',
                'programme' => 'SEO/SEA, Social Media Marketing, Content Marketing, E-commerce, Web Analytics.',
                'duree_formation' => '1 an',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],

            // FORMATIONS PRINCIPALES - Droit
            [
                'titre' => 'Licence Fondamentale en Droit',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation générale en sciences juridiques couvrant le droit privé et public.',
                'mention_id' => $droit->id,
                'diplome' => 'LICENCE_FONDAMENTALE',
                'condition_admission' => 'Baccalauréat toutes séries.',
                'profile_intree' => 'Bacheliers intéressés par les sciences juridiques et sociales.',
                'specialite' => 'Droit général',
                'objectifs' => 'Acquérir les fondamentaux du droit. Comprendre le système juridique. Développer les capacités d\'argumentation et d\'analyse juridique.',
                'profile_sortie' => 'Poursuivre en Master Droit, Assistant juridique, Métiers de la fonction publique',
                'evaluation' => 'Contrôle continu (40%), Examens écrits (60%)',
                'programme' => 'L1: Introduction au droit, Droit civil. L2: Droit commercial, Droit pénal. L3: Droit administratif, Droit du travail.',
                'duree_formation' => '3 ans',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],

            // FORMATIONS PRINCIPALES - Sociologie
            [
                'titre' => 'Master en Sociologie Appliquée',
                'type_formation' => 'PRINCIPALE',
                'description' => 'Formation en méthodes d\'enquête et analyse sociale appliquée.',
                'mention_id' => $sociologie->id,
                'diplome' => 'MASTER',
                'condition_admission' => 'Licence en sociologie, sciences sociales ou domaine connexe.',
                'profile_intree' => 'Diplômés en sciences sociales avec intérêt pour la recherche appliquée.',
                'specialite' => 'Enquêtes sociales, Développement local',
                'objectifs' => 'Former des sociologues capables de conduire des études terrain. Maîtriser les méthodes qualitatives et quantitatives. Analyser les dynamiques sociales contemporaines.',
                'profile_sortie' => 'Chargé d\'études, Consultant social, Chercheur',
                'evaluation' => 'Enquêtes de terrain (45%), Mémoire (35%), Examens (20%)',
                'programme' => 'Méthodes d\'enquête, Statistiques sociales, Analyse qualitative, Sociologie urbaine.',
                'duree_formation' => '2 ans',
                'frais_scolarite' => 'Voir les détails dans les offres de formation par année',
                'statut_formation' => 'ACTIVE',
            ],

            // FORMATIONS MODULAIRES (pas de mention)
            [
                'titre' => 'Formation Intensive en Design Thinking',
                'type_formation' => 'MODULAIRE',
                'description' => 'Atelier pratique de 3 jours sur la méthodologie Design Thinking pour l\'innovation.',
                'mention_id' => null,
                'diplome' => null,
                'condition_admission' => 'Ouvert à tous, professionnels et étudiants.',
                'profile_intree' => 'Professionnels souhaitant innover, entrepreneurs, chefs de projet.',
                'specialite' => 'Innovation, Design Thinking',
                'objectifs' => 'Comprendre la méthodologie Design Thinking. Apprendre à prototyper rapidement. Développer l\'esprit d\'innovation.',
                'profile_sortie' => 'Certificat de participation',
                'evaluation' => 'Projet de groupe, présentation',
                'programme' => 'Empathie, Définition, Idéation, Prototypage, Test',
                'duree_formation' => '3 jours',
                'frais_scolarite' => 'Variable selon l\'année',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Initiation à la Cybersécurité',
                'type_formation' => 'MODULAIRE',
                'description' => 'Formation courte sur les bases de la sécurité informatique.',
                'mention_id' => null,
                'diplome' => null,
                'condition_admission' => 'Connaissances de base en informatique.',
                'profile_intree' => 'Professionnels IT, étudiants en informatique.',
                'specialite' => 'Sécurité informatique',
                'objectifs' => 'Comprendre les menaces cyber. Apprendre les bonnes pratiques de sécurité. Découvrir les outils de protection.',
                'profile_sortie' => 'Certificat de formation',
                'evaluation' => 'QCM et exercices pratiques',
                'programme' => 'Menaces cyber, Cryptographie, Pare-feu, Tests d\'intrusion',
                'duree_formation' => '5 jours',
                'frais_scolarite' => 'Variable selon l\'année',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Gestion de Projet Agile (Scrum)',
                'type_formation' => 'MODULAIRE',
                'description' => 'Formation certifiante aux méthodes agiles et framework Scrum.',
                'mention_id' => null,
                'diplome' => null,
                'condition_admission' => 'Expérience en gestion de projet souhaitée.',
                'profile_intree' => 'Chefs de projet, Product Owners, Développeurs.',
                'specialite' => 'Agilité, Scrum',
                'objectifs' => 'Maîtriser le framework Scrum. Devenir Scrum Master certifié. Animer des cérémonies agiles.',
                'profile_sortie' => 'Scrum Master, Agile Coach',
                'evaluation' => 'Examen de certification',
                'programme' => 'Principes agiles, Rôles Scrum, Sprints, Rétrospectives',
                'duree_formation' => '2 jours',
                'frais_scolarite' => 'Variable selon l\'année',
                'statut_formation' => 'ACTIVE',
            ],
            [
                'titre' => 'Excel Avancé pour Professionnels',
                'type_formation' => 'MODULAIRE',
                'description' => 'Maîtriser les fonctionnalités avancées d\'Excel pour l\'analyse de données.',
                'mention_id' => null,
                'diplome' => null,
                'condition_admission' => 'Connaissances de base d\'Excel.',
                'profile_intree' => 'Comptables, gestionnaires, analystes.',
                'specialite' => 'Bureautique, Analyse de données',
                'objectifs' => 'Maîtriser les tableaux croisés dynamiques. Utiliser les fonctions avancées. Créer des dashboards.',
                'profile_sortie' => 'Certificat de compétence Excel avancé',
                'evaluation' => 'Exercices pratiques',
                'programme' => 'Tableaux croisés, Macros VBA, Power Query, Graphiques avancés',
                'duree_formation' => '3 jours',
                'frais_scolarite' => 'Variable selon l\'année',
                'statut_formation' => 'ACTIVE',
            ],
        ];

        foreach ($formations as $formation) {
            Formation::create($formation);
        }

        $this->command->info('✅ ' . count($formations) . ' formations créées (9 principales + 4 modulaires)');
    }
}