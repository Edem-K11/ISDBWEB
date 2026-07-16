<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Redacteur;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $redacteur1 = Redacteur::where('email', 'david.wottor@example.com')->first();
        $redacteur2 = Redacteur::where('email', 'marie.dubois@example.com')->first();
        
        $tagEducation = Tag::where('nom', 'Éducation')->first();
        $tagTech = Tag::where('nom', 'Technologie')->first();
        $tagScience = Tag::where('nom', 'Science')->first();

        $blog1 = Blog::create([
            'titre' => 'La Journée Mondiale de la Philosophie met en lumière les Enjeux Contemporains',
            'resume' => 'Une réflexion approfondie sur les grands enjeux philosophiques de notre époque.',
            'contenu' => '<p>Contenu détaillé de l\'article...</p>',
            'cover_image' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
            'redacteur_id' => $redacteur1->id,
            'statut' => 'publie',
            'slug' => 'journee-mondiale-philosophie-enjeux-contemporains',
        ]);
        $blog1->tags()->attach([$tagEducation->id, $tagScience->id]);

        $blog2 = Blog::create([
            'titre' => 'Les innovations dans le domaine de l\'IA',
            'resume' => 'Découvrez les dernières avancées technologiques.',
            'contenu' => '<p>Contenu détaillé...</p>',
            'cover_image' => 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
            'redacteur_id' => $redacteur2->id,
            'statut' => 'publie',
            'slug' => 'innovations-domaine-ia',
        ]);
        $blog2->tags()->attach([$tagTech->id, $tagScience->id]);
    }
}