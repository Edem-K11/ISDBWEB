<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstitutSetting extends Model
{
    use HasFactory;

    protected $casts = [
        'galerie' => 'array',
        'date_ouverture_inscriptions' => 'date',
        'date_cloture_inscriptions' => 'date',
        'date_rentree' => 'date',
    ];

    protected $fillable = [
        'nom',
        'logo',
        'galerie',
        'description',
        'adresse',
        'maps_url',
        'telephone',
        'telephone_2',
        'email',
        'email_2',
        'fax',
        'site_web',
        'date_ouverture_inscriptions',
        'date_cloture_inscriptions',
        'date_rentree',
        'facebook_url',
        'twitter_url',
        'linkedin_url',
        'instagram_url',
        'youtube_url',
        'tiktok_url',
        'whatsapp',
    ];

    public static function getSettings(): self
    {
        return static::firstOrCreate([], static::defaults());
    }

    public static function defaults(): array
    {
        return [
            'nom' => 'Institut Supérieur Don Bosco',
            'logo' => null,
            'galerie' => [],
            'description' => 'Institution d\'excellence dédiée à l\'éducation, la recherche et l\'innovation.',
            'adresse' => 'Ouagadougou, Burkina Faso',
            'maps_url' => null,
            'telephone' => null,
            'telephone_2' => null,
            'email' => 'admission@isdb.edu',
            'email_2' => null,
            'fax' => null,
            'site_web' => null,
            'date_ouverture_inscriptions' => null,
            'date_cloture_inscriptions' => null,
            'date_rentree' => null,
            'facebook_url' => null,
            'twitter_url' => null,
            'linkedin_url' => null,
            'instagram_url' => null,
            'youtube_url' => null,
            'tiktok_url' => null,
            'whatsapp' => null,
        ];
    }
}
