<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class FormationModulaire extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'formation_modulaires';

    const STATUT_ACTIVE = 'ACTIVE';
    const STATUT_ARCHIVEE = 'ARCHIVEE';
    const STATUT_SUPPRIMEE = 'SUPPRIMEE';

    protected $fillable = [
        'titre',
        'slug',
        'description',
        'contenu',
        'condition_admission',
        'objectifs',
        'competences_visees',
        'debouches',
        'profile_sortie',
        'evaluation',
        'programme',
        'programme_pdf',
        'duree_heures',
        'frais_inscription',
        'frais_formation',
        'statut_formation',
    ];

    protected $casts = [
        'duree_heures' => 'integer',
        'frais_inscription' => 'decimal:2',
        'frais_formation' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function scopeActives($query)
    {
        return $query->where('statut_formation', self::STATUT_ACTIVE);
    }

    public function getEstActiveAttribute(): bool
    {
        return $this->statut_formation === self::STATUT_ACTIVE;
    }

    protected static function booted(): void
    {
        static::creating(function (FormationModulaire $formation) {
            if (empty($formation->slug)) {
                $baseSlug = Str::slug($formation->titre);
                $slug = $baseSlug;
                $counter = 1;

                while (self::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }

                $formation->slug = $slug;
            }
        });
    }
}
