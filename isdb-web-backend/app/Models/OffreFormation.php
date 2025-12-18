<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OffreFormation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'offres_formations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'formation_id',
        'annee_academique_id',
        'chef_parcours',
        'animateur',
        'date_debut',
        'date_fin',
        'place_limited',
        'prix',
        'est_dispensee',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'formation_id' => 'integer',
        'annee_academique_id' => 'integer',
        'date_debut' => 'date',
        'date_fin' => 'date',
        'place_limited' => 'integer',
        'prix' => 'decimal:2',
        'est_dispensee' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the formation that owns the offre.
     */
    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class, 'formation_id');
    }

    /**
     * Get the année académique that owns the offre.
     */
    public function anneeAcademique(): BelongsTo
    {
        return $this->belongsTo(AnneeAcademique::class, 'annee_academique_id');
    }

    /**
     * Scope pour obtenir les offres de l'année académique actuelle.
     */
    public function scopeAnneeActuelle($query)
    {
        return $query->whereHas('anneeAcademique', function ($q) {
            $q->where('est_actuelle', true);
        });
    }

    /**
     * Scope pour obtenir les offres dispensées.
     */
    public function scopeDispensees($query)
    {
        return $query->where('est_dispensee', true);
    }

    /**
     * Scope pour obtenir les offres par année académique.
     */
    public function scopeParAnnee($query, $anneeAcademiqueId)
    {
        return $query->where('annee_academique_id', $anneeAcademiqueId);
    }

    /**
     * Scope pour obtenir les offres par formation.
     */
    public function scopeParFormation($query, $formationId)
    {
        return $query->where('formation_id', $formationId);
    }

    /**
     * Scope pour obtenir les offres de formations principales.
     */
    public function scopeFormationsPrincipales($query)
    {
        return $query->whereHas('formation', function ($q) {
            $q->where('type_formation', Formation::TYPE_PRINCIPALE);
        });
    }

    /**
     * Scope pour obtenir les offres de formations modulaires.
     */
    public function scopeFormationsModulaires($query)
    {
        return $query->whereHas('formation', function ($q) {
            $q->where('type_formation', Formation::TYPE_MODULAIRE);
        });
    }

    /**
     * Scope pour obtenir les offres avec places limitées disponibles.
     */
    public function scopeAvecPlacesDisponibles($query)
    {
        return $query->whereNotNull('place_limited')
                     ->where('place_limited', '>', 0);
    }

    /**
     * Accessor pour vérifier si l'offre est en cours.
     */
    public function getEstEnCoursAttribute(): bool
    {
        $now = now();
        return $this->date_debut <= $now && $this->date_fin >= $now;
    }

    /**
     * Accessor pour vérifier si l'offre est future.
     */
    public function getEstFutureAttribute(): bool
    {
        return $this->date_debut > now();
    }

    /**
     * Accessor pour vérifier si l'offre est passée.
     */
    public function getEstPasseeAttribute(): bool
    {
        return $this->date_fin < now();
    }

    /**
     * Accessor pour vérifier si des places sont disponibles.
     */
    public function getAPlacesDisponiblesAttribute(): bool
    {
        return $this->place_limited === null || $this->place_limited > 0;
    }

    /**
     * Boot method pour gérer les événements du modèle.
     */
    protected static function boot()
    {
        parent::boot();

        // Validation avant sauvegarde
        static::saving(function ($offre) {
            // Vérifier qu'une offre n'existe pas déjà pour cette formation et cette année
            $existingOffre = static::where('formation_id', $offre->formation_id)
                ->where('annee_academique_id', $offre->annee_academique_id)
                ->where('id', '!=', $offre->id)
                ->exists();

            if ($existingOffre) {
                throw new \InvalidArgumentException(
                    'Cette formation est déjà offerte pour cette année académique.'
                );
            }
        });
    }
}