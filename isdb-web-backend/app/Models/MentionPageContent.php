<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentionPageContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'mention_id',
        'hero_title',
        'hero_subtitle',
        'hero_description',
        'section_title',
        'section_description',
        'cta_title',
        'cta_description',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'theme',
    ];

    protected $casts = [
        'seo_keywords' => 'array',
    ];

    /**
     * Relation avec Mention
     */
    public function mention(): BelongsTo
    {
        return $this->belongsTo(Mention::class);
    }

    /**
     * Vérifier si le contenu est complet
     */
    public function isComplete(): bool
    {
        return !empty($this->hero_title) 
            && !empty($this->hero_subtitle) 
            && !empty($this->section_title);
    }
}