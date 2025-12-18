<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Domaine extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'domaines';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the mentions for the domaine.
     */
    public function mentions(): HasMany
    {
        return $this->hasMany(Mention::class, 'domaine_id');
    }

    /**
     * Get all formations through mentions.
     */
    public function formations()
    {
        return $this->hasManyThrough(
            Formation::class,
            Mention::class,
            'domaine_id',   // Foreign key on mentions table
            'mention_id',   // Foreign key on formations table
            'id',           // Local key on domaines table
            'id'            // Local key on mentions table
        );
    }

    /**
     * Scope pour obtenir les domaines avec leurs mentions.
     */
    public function scopeAvecMentions($query)
    {
        return $query->with('mentions');
    }

    /**
     * Scope pour obtenir les domaines qui ont des formations actives.
     */
    public function scopeAvecFormationsActives($query)
    {
        return $query->whereHas('formations', function ($q) {
            $q->where('statut_formation', Formation::STATUT_ACTIVE);
        });
    }

    /**
     * Accessor pour compter le nombre de mentions.
     */
    public function getNombreMentionsAttribute(): int
    {
        return $this->mentions()->count();
    }

    /**
     * Accessor pour compter le nombre de formations (via mentions).
     */
    public function getNombreFormationsAttribute(): int
    {
        return $this->formations()->count();
    }
}