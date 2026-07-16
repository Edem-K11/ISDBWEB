<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_title',
        'hero_highlight',
        'hero_description',
        'hero_image',
        'hero_cta_primary_label',
        'hero_cta_primary_url',
        'hero_cta_secondary_label',
        'hero_cta_secondary_url',
        'tagline',
        'stats',
        'features_title',
        'features_description',
        'features',
        'formations_section_title',
        'formations_section_description',
        'cta_title',
        'cta_description',
        'cta_button_label',
        'cta_button_url',
    ];

    protected $casts = [
        'stats' => 'array',
        'features' => 'array',
    ];

    public static function getContent(): self
    {
        return static::firstOrCreate([], static::defaults());
    }

    public static function defaults(): array
    {
        return [
            'hero_title' => 'Votre formation d\'excellence',
            'hero_highlight' => 'commence ici',
            'hero_description' => 'L\'Institut Supérieur Don Bosco vous accompagne dans votre parcours académique avec des formations innovantes, un accompagnement personnalisé et des opportunités uniques.',
            'hero_image' => null,
            'hero_cta_primary_label' => 'Découvrir nos formations',
            'hero_cta_primary_url' => '/formations',
            'hero_cta_secondary_label' => 'Postuler maintenant',
            'hero_cta_secondary_url' => '/admission',
            'tagline' => 'Lancé au TOGO depuis 1975',
            'stats' => [
                ['value' => '98%', 'label' => 'Taux de réussite'],
                ['value' => '20+', 'label' => 'Experts enseignants'],
                ['value' => '10+', 'label' => 'Années d\'expérience'],
            ],
            'features_title' => 'Tout ce dont vous avez besoin pour réussir',
            'features_description' => 'Un accompagnement complet de l\'inscription à l\'insertion professionnelle',
            'features' => [],
            'formations_section_title' => 'Nos domaines de formation',
            'formations_section_description' => 'Des parcours adaptés à vos ambitions professionnelles',
            'cta_title' => 'Prêt à rejoindre l\'ISDB ?',
            'cta_description' => 'Rejoignez une communauté d\'apprenants engagés et formez-vous aux métiers de demain.',
            'cta_button_label' => 'Candidater maintenant',
            'cta_button_url' => '/admission',
        ];
    }
}
