<?php

namespace Database\Seeders;

use App\Models\Mention;
use App\Models\MentionPageContent;
use Illuminate\Database\Seeder;

class MentionPageContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            'Philosophie' => [
                'hero_title' => 'Philosophie',
                'hero_subtitle' => 'Licence Fondamentale & Master Recherche',
                'hero_description' => 'Une formation exigeante pour développer la pensée critique et aborder les grands questionnements de la philosophie contemporaine.',
                'section_title' => 'Nos formations en Philosophie',
                'section_description' => 'Parcours licence fondamentale et master recherche au sein des sciences de l\'homme et de la société.',
                'cta_title' => 'Intéressé par la Philosophie ?',
                'cta_description' => 'Consultez les conditions d\'admission et postulez à l\'ISDB.',
                'seo_title' => 'Philosophie - Institut Supérieur Don Bosco',
                'seo_description' => 'Formations en philosophie à l\'Institut Supérieur Don Bosco : licence fondamentale et master recherche.',
                'theme' => 'green',
            ],
            'Sciences et Techniques de la Communication' => [
                'hero_title' => 'Sciences et Techniques de la Communication',
                'hero_subtitle' => 'Production multimédia & Relations publiques',
                'hero_description' => 'Formez-vous aux métiers de la communication, de la production audiovisuelle et des relations publiques.',
                'section_title' => 'Nos formations en Communication',
                'section_description' => 'Licences professionnelles en production multimédia et en communication / relations publiques.',
                'cta_title' => 'Rejoignez nos formations en Communication',
                'cta_description' => 'Découvrez nos parcours professionnalisants en STC.',
                'seo_title' => 'Communication - Institut Supérieur Don Bosco',
                'seo_description' => 'Formations en sciences et techniques de la communication à l\'ISDB.',
                'theme' => 'orange',
            ],
            'Sciences de l\'Education' => [
                'hero_title' => 'Sciences de l\'Education',
                'hero_subtitle' => 'Licence Fondamentale & Master Professionnel',
                'hero_description' => 'Préparez-vous aux métiers de l\'éducation et de la formation avec des parcours ancrés dans la pratique.',
                'section_title' => 'Nos formations en Sciences de l\'Education',
                'section_description' => 'Licence fondamentale et master professionnel en sciences de l\'éducation.',
                'cta_title' => 'Construisez votre avenir en éducation',
                'cta_description' => 'Rejoignez l\'ISDB pour une formation professionnalisante.',
                'seo_title' => 'Sciences de l\'Education - Institut Supérieur Don Bosco',
                'seo_description' => 'Formations en sciences de l\'éducation à l\'Institut Supérieur Don Bosco.',
                'theme' => 'red',
            ],
        ];

        foreach ($contents as $mentionTitre => $content) {
            $mention = Mention::where('titre', $mentionTitre)->firstOrFail();
            MentionPageContent::create(array_merge($content, ['mention_id' => $mention->id]));
        }

        $this->command->info('✅ Contenus de pages mentions créés');
    }
}
