<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstitutSetting extends Model
{
    use HasFactory;

    protected $casts = [
        'galerie' => 'array',
    ];

    protected $fillable = [
        'nom',
        'logo',
        'galerie',
        'description',
        'adresse',
        'telephone',
        'email',
        'fax',
        'site_web',
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
            'telephone' => null,
            'email' => 'admission@isdb.edu',
            'fax' => null,
            'site_web' => null,
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
