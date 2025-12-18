<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnneeAcademique extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'annees_academiques';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'annee_debut',
        'annee_fin',
        'est_actuelle',
        'date_debut',
        'date_fin',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'annee_debut' => 'integer',
        'annee_fin' => 'integer',
        'est_actuelle' => 'boolean',
        'date_debut' => 'date',
        'date_fin' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the offres de formation for this année académique.
     */
    public function offresFormations(): HasMany
    {
        return $this->hasMany(OffreFormation::class, 'annee_academique_id');
    }

    /**
     * Scope pour obtenir l'année académique actuelle.
     */
    public function scopeActuelle($query)
    {
        return $query->where('est_actuelle', true);
    }

    /**
     * Scope pour obtenir les années académiques futures.
     */
    public function scopeFutures($query)
    {
        return $query->where('date_debut', '>', now());
    }

    /**
     * Scope pour obtenir les années académiques passées.
     */
    public function scopePassees($query)
    {
        return $query->where('date_fin', '<', now());
    }

    /**
     * Accessor pour obtenir le libellé de l'année académique.
     * Exemple: "2024-2025"
     */
    public function getLibelleAttribute(): string
    {
        return $this->annee_debut . '-' . $this->annee_fin;
    }

    /**
     * Boot method pour gérer les événements du modèle.
     */
    protected static function boot()
    {
        parent::boot();

        // Avant de sauvegarder, si est_actuelle = true, désactiver les autres
        static::saving(function ($anneeAcademique) {
            if ($anneeAcademique->est_actuelle) {
                static::where('id', '!=', $anneeAcademique->id)
                    ->update(['est_actuelle' => false]);
            }
        });
    }
}