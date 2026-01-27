<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnneeAcademique extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'annees_academiques';

    protected $fillable = [
        'annee_debut',
        'annee_fin',
        'date_debut',
        'date_fin',
    ];

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

    public function offresFormations(): HasMany
    {
        return $this->hasMany(OffreFormation::class, 'annee_academique_id');
    }
    

    public function scopeActuelle($query)
    {
        return $query->where('est_actuelle', true);
    }

    public function scopeFutures($query)
    {
        return $query->where('date_debut', '>', now());
    }

    public function scopePassees($query)
    {
        return $query->where('date_fin', '<', now());
    }

    public function getLibelleAttribute(): string
    {
        return $this->annee_debut . '-' . $this->annee_fin;
    }

}