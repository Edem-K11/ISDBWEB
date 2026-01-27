<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mention;
use App\Models\MentionPageContent;
use Illuminate\Support\Facades\DB;

class MentionPageContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('mention_page_contents')->truncate();

        $contents = [
            // SCIENCES & TECHNOLOGIES
            [
                'mention_slug' => 'informatique',
                'hero_title' => 'INFORMATIQUE',
                'hero_subtitle' => 'Innover pour l\'avenir numérique',
                'hero_description' => 'Plongez dans l\'univers du développement logiciel, des réseaux et des systèmes d\'information. Nos formations vous préparent aux métiers de demain dans un secteur en constante évolution.',
                'section_title' => 'Formations en Informatique',
                'section_description' => 'Découvrez nos parcours alliant théorie et pratique pour maîtriser les technologies actuelles et anticiper celles de demain.',
                'cta_title' => 'Prêt à façonner le futur numérique ?',
                'cta_description' => 'Rejoignez une communauté de passionnés et développez vos compétences techniques',
                'seo_title' => 'Informatique - Formations ISDB',
                'seo_description' => 'Formation en informatique : développement, réseaux, systèmes. Licence et Master à ISDB.',
                'seo_keywords' => json_encode(['informatique', 'développement', 'réseaux', 'programmation']),
                'theme' => 'green',
            ],
            [
                'mention_slug' => 'genie-electrique-et-automatisme',
                'hero_title' => 'GÉNIE ÉLECTRIQUE',
                'hero_subtitle' => 'Maîtriser l\'énergie et l\'automatisation',
                'hero_description' => 'Formez-vous aux systèmes électriques, à l\'automatisme industriel et aux énergies renouvelables. Devenez expert en conception et maintenance de solutions techniques innovantes.',
                'section_title' => 'Formations en Génie Électrique',
                'section_description' => 'Des parcours complets pour exceller dans l\'électrotechnique, l\'automatisme et l\'instrumentation industrielle.',
                'cta_title' => 'Prêt à électrifier votre carrière ?',
                'cta_description' => 'Maîtrisez les technologies qui alimentent l\'industrie moderne',
                'seo_title' => 'Génie Électrique - ISDB',
                'seo_description' => 'Formation en génie électrique et automatisme industriel à ISDB.',
                'seo_keywords' => json_encode(['génie électrique', 'automatisme', 'électrotechnique']),
                'theme' => 'orange',
            ],
            [
                'mention_slug' => 'mathematiques-appliquees',
                'hero_title' => 'MATHÉMATIQUES APPLIQUÉES',
                'hero_subtitle' => 'La puissance du raisonnement logique',
                'hero_description' => 'Explorez les mathématiques appliquées, les statistiques et la modélisation. Développez votre capacité d\'analyse pour résoudre des problèmes complexes.',
                'section_title' => 'Formations en Mathématiques Appliquées',
                'section_description' => 'Maîtrisez les outils mathématiques essentiels pour l\'analyse de données et la prise de décision.',
                'cta_title' => 'Prêt à calculer votre avenir ?',
                'cta_description' => 'Rejoignez l\'excellence mathématique et analytique',
                'seo_title' => 'Mathématiques Appliquées - ISDB',
                'seo_description' => 'Formation en mathématiques, statistiques et modélisation à ISDB.',
                'seo_keywords' => json_encode(['mathématiques', 'statistiques', 'modélisation']),
                'theme' => 'red',
            ],
            [
                'mention_slug' => 'genie-civil',
                'hero_title' => 'GÉNIE CIVIL',
                'hero_subtitle' => 'Bâtir les infrastructures de demain',
                'hero_description' => 'Formez-vous à la construction, aux travaux publics et à l\'ingénierie des structures. Participez à la création des villes et infrastructures du futur.',
                'section_title' => 'Formations en Génie Civil',
                'section_description' => 'Des programmes complets pour devenir expert en conception, réalisation et gestion de projets de construction.',
                'cta_title' => 'Prêt à construire l\'avenir ?',
                'cta_description' => 'Maîtrisez l\'art de bâtir des infrastructures durables',
                'seo_title' => 'Génie Civil - ISDB',
                'seo_description' => 'Formation en génie civil, construction et travaux publics à ISDB.',
                'seo_keywords' => json_encode(['génie civil', 'construction', 'infrastructures']),
                'theme' => 'gold',
            ],

            // GESTION & ÉCONOMIE
            [
                'mention_slug' => 'gestion-des-entreprises',
                'hero_title' => 'GESTION DES ENTREPRISES',
                'hero_subtitle' => 'Piloter la performance organisationnelle',
                'hero_description' => 'Développez vos compétences en management, stratégie et gestion d\'entreprise. Apprenez à diriger avec efficacité dans un environnement économique complexe.',
                'section_title' => 'Formations en Gestion des Entreprises',
                'section_description' => 'Parcours professionnalisants pour devenir manager ou créer votre entreprise.',
                'cta_title' => 'Prêt à diriger avec excellence ?',
                'cta_description' => 'Devenez le leader que les entreprises recherchent',
                'seo_title' => 'Gestion des Entreprises - ISDB',
                'seo_description' => 'Formation en management et stratégie d\'entreprise à ISDB.',
                'seo_keywords' => json_encode(['gestion', 'management', 'stratégie']),
                'theme' => 'green',
            ],
            [
                'mention_slug' => 'comptabilites-et-finances',
                'hero_title' => 'COMPTABILITÉ & FINANCES',
                'hero_subtitle' => 'Maîtriser les chiffres pour décider',
                'hero_description' => 'Formez-vous aux métiers de la comptabilité, de l\'audit et du contrôle de gestion. Devenez expert financier recherché par les entreprises.',
                'section_title' => 'Formations en Comptabilité et Finances',
                'section_description' => 'Programmes complets pour exceller dans les métiers comptables et financiers.',
                'cta_title' => 'Prêt à maîtriser la finance ?',
                'cta_description' => 'Devenez expert comptable ou contrôleur de gestion',
                'seo_title' => 'Comptabilité & Finances - ISDB',
                'seo_description' => 'Formation en comptabilité, audit et finance à ISDB.',
                'seo_keywords' => json_encode(['comptabilité', 'finance', 'audit']),
                'theme' => 'red',
            ],
            [
                'mention_slug' => 'marketing-et-communication',
                'hero_title' => 'MARKETING & COMMUNICATION',
                'hero_subtitle' => 'Créer de la valeur par la communication',
                'hero_description' => 'Maîtrisez le marketing digital, la communication d\'entreprise et la stratégie de marque. Apprenez à séduire et convaincre dans l\'ère numérique.',
                'section_title' => 'Formations en Marketing et Communication',
                'section_description' => 'Parcours innovants pour devenir expert en marketing digital et communication stratégique.',
                'cta_title' => 'Prêt à révolutionner la communication ?',
                'cta_description' => 'Maîtrisez les stratégies marketing qui font la différence',
                'seo_title' => 'Marketing & Communication - ISDB',
                'seo_description' => 'Formation en marketing digital et communication d\'entreprise à ISDB.',
                'seo_keywords' => json_encode(['marketing', 'communication', 'digital']),
                'theme' => 'orange',
            ],
            [
                'mention_slug' => 'economie-et-developpement',
                'hero_title' => 'ÉCONOMIE & DÉVELOPPEMENT',
                'hero_subtitle' => 'Comprendre et transformer l\'économie',
                'hero_description' => 'Analysez les dynamiques économiques, les politiques publiques et le développement durable. Participez à la construction d\'un avenir économique équitable.',
                'section_title' => 'Formations en Économie et Développement',
                'section_description' => 'Programmes orientés vers l\'analyse économique et les enjeux du développement.',
                'cta_title' => 'Prêt à façonner l\'économie de demain ?',
                'cta_description' => 'Devenez acteur du développement économique',
                'seo_title' => 'Économie & Développement - ISDB',
                'seo_description' => 'Formation en analyse économique et développement à ISDB.',
                'seo_keywords' => json_encode(['économie', 'développement', 'politiques publiques']),
                'theme' => 'gold',
            ],

            // SCIENCES HUMAINES & SOCIALES
            [
                'mention_slug' => 'droit',
                'hero_title' => 'DROIT',
                'hero_subtitle' => 'Défendre la justice et le droit',
                'hero_description' => 'Formez-vous au droit privé, public et des affaires. Développez votre esprit juridique et votre capacité d\'argumentation pour défendre les droits et libertés.',
                'section_title' => 'Formations en Droit',
                'section_description' => 'Parcours juridiques complets pour devenir juriste, avocat ou conseiller juridique.',
                'cta_title' => 'Prêt à défendre la justice ?',
                'cta_description' => 'Rejoignez la profession juridique avec excellence',
                'seo_title' => 'Droit - ISDB',
                'seo_description' => 'Formation en droit privé, public et des affaires à ISDB.',
                'seo_keywords' => json_encode(['droit', 'justice', 'juridique']),
                'theme' => 'green',
            ],
            [
                'mention_slug' => 'sociologie',
                'hero_title' => 'SOCIOLOGIE',
                'hero_subtitle' => 'Comprendre la société et ses dynamiques',
                'hero_description' => 'Analysez les phénomènes sociaux, les comportements collectifs et les transformations sociétales. Devenez expert en analyse sociale et méthodes d\'enquête.',
                'section_title' => 'Formations en Sociologie',
                'section_description' => 'Programmes d\'analyse sociale pour comprendre et agir sur le monde contemporain.',
                'cta_title' => 'Prêt à décrypter la société ?',
                'cta_description' => 'Devenez sociologue et analyste des transformations sociales',
                'seo_title' => 'Sociologie - ISDB',
                'seo_description' => 'Formation en sociologie et analyse sociale à ISDB.',
                'seo_keywords' => json_encode(['sociologie', 'analyse sociale', 'enquête']),
                'theme' => 'red',
            ],
            [
                'mention_slug' => 'psychologie',
                'hero_title' => 'PSYCHOLOGIE',
                'hero_subtitle' => 'Explorer l\'esprit humain',
                'hero_description' => 'Formez-vous à la psychologie clinique, du travail et du développement. Comprenez les mécanismes psychologiques pour accompagner et aider les individus.',
                'section_title' => 'Formations en Psychologie',
                'section_description' => 'Parcours complets pour devenir psychologue clinicien, du travail ou chercheur.',
                'cta_title' => 'Prêt à comprendre l\'humain ?',
                'cta_description' => 'Rejoignez les professions de l\'accompagnement psychologique',
                'seo_title' => 'Psychologie - ISDB',
                'seo_description' => 'Formation en psychologie clinique et du travail à ISDB.',
                'seo_keywords' => json_encode(['psychologie', 'clinique', 'développement']),
                'theme' => 'orange',
            ],
            [
                'mention_slug' => 'communication-et-journalisme',
                'hero_title' => 'COMMUNICATION & JOURNALISME',
                'hero_subtitle' => 'Informer et communiquer avec impact',
                'hero_description' => 'Maîtrisez l\'art du journalisme, de la communication médiatique et de la production de contenus. Devenez acteur de l\'information dans un monde connecté.',
                'section_title' => 'Formations en Communication et Journalisme',
                'section_description' => 'Programmes orientés vers les métiers de l\'information et de la communication médiatique.',
                'cta_title' => 'Prêt à façonner l\'information ?',
                'cta_description' => 'Devenez journaliste ou professionnel de la communication',
                'seo_title' => 'Communication & Journalisme - ISDB',
                'seo_description' => 'Formation en journalisme et communication médiatique à ISDB.',
                'seo_keywords' => json_encode(['journalisme', 'communication', 'médias']),
                'theme' => 'gold',
            ],
        ];

        foreach ($contents as $content) {
            $mention = Mention::where('slug', $content['mention_slug'])->first();
            
            if ($mention) {
                MentionPageContent::create([
                    'mention_id' => $mention->id,
                    'hero_title' => $content['hero_title'],
                    'hero_subtitle' => $content['hero_subtitle'],
                    'hero_description' => $content['hero_description'],
                    'section_title' => $content['section_title'],
                    'section_description' => $content['section_description'],
                    'cta_title' => $content['cta_title'],
                    'cta_description' => $content['cta_description'],
                    'seo_title' => $content['seo_title'],
                    'seo_description' => $content['seo_description'],
                    'seo_keywords' => $content['seo_keywords'],
                    'theme' => $content['theme'],
                ]);

                $this->command->info("✅ Contenu créé pour : {$content['hero_title']}");
            } else {
                $this->command->warn("⚠️  Mention non trouvée : {$content['mention_slug']}");
            }
        }

        $this->command->info('🎉 Seeder terminé !');
    }
}