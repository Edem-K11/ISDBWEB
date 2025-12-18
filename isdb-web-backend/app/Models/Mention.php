<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mention extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mentions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',
        'description',
        'domaine_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'domaine_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the domaine that owns the mention.
     */
    public function domaine(): BelongsTo
    {
        return $this->belongsTo(Domaine::class, 'domaine_id');
    }

    /**
     * Get the formations for the mention.
     */
    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class, 'mention_id');
    }

    /**
     * Scope pour obtenir les mentions d'un domaine spécifique.
     */
    public function scopeParDomaine($query, $domaineId)
    {
        return $query->where('domaine_id', $domaineId);
    }

    /**
     * Scope pour obtenir les mentions avec leur domaine.
     */
    public function scopeAvecDomaine($query)
    {
        return $query->with('domaine');
    }

    /**
     * Scope pour obtenir les mentions qui ont des formations actives.
     */
    public function scopeAvecFormationsActives($query)
    {
        return $query->whereHas('formations', function ($q) {
            $q->where('statut_formation', Formation::STATUT_ACTIVE);
        });
    }

    /**
     * Accessor pour compter le nombre de formations.
     */
    public function getNombreFormationsAttribute(): int
    {
        return $this->formations()->count();
    }

    /**
     * Accessor pour obtenir le nom complet (Domaine - Mention).
     */
    public function getNomCompletAttribute(): string
    {
        return $this->domaine?->nom . ' - ' . $this->titre;
    }
}