<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'formations';

    /**
     * Les constantes pour les types de formation.
     */
    const TYPE_PRINCIPALE = 'PRINCIPALE';
    const TYPE_MODULAIRE = 'MODULAIRE';

    /**
     * Les constantes pour les diplômes.
     */
    const DIPLOME_LICENCE_PRO = 'LICENCE_PROFESSIONNELLE';
    const DIPLOME_LICENCE_FOND = 'LICENCE_FONDAMENTALE';
    const DIPLOME_MASTER = 'MASTER';
    const CERTIFICAT_MODULE = 'CERTIFICAT_MODULE';

    /**
     * Les constantes pour les statuts.
     */
    const STATUT_ACTIVE = 'ACTIVE';
    const STATUT_ARCHIVEE = 'ARCHIVEE';
    const STATUT_SUPPRIMEE = 'SUPPRIMEE';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',
        'type_formation',
        'description',
        'mention_id',
        'diplome',
        'condition_admission',
        'profile_intree',
        'specialite',
        'objectifs',
        'profile_sortie',
        'evaluation',
        'programme',
        'programme_pdf',
        'duree_formation',
        'frais_scolarite',
        'statut_formation',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the mention that owns the formation (pour formations principales).
     */
    public function mention(): BelongsTo
    {
        return $this->belongsTo(Mention::class);
    }

    /**
     * Get the offres de formation for this formation.
     */
    public function offresFormations(): HasMany
    {
        return $this->hasMany(OffreFormation::class, 'formation_id');
    }

    /**
     * Scope pour obtenir les formations principales.
     */
    public function scopePrincipales($query)
    {
        return $query->where('type_formation', self::TYPE_PRINCIPALE);
    }

    /**
     * Scope pour obtenir les formations modulaires.
     */
    public function scopeModulaires($query)
    {
        return $query->where('type_formation', self::TYPE_MODULAIRE);
    }

    /**
     * Scope pour obtenir les formations actives.
     */
    public function scopeActives($query)
    {
        return $query->where('statut_formation', self::STATUT_ACTIVE);
    }

    /**
     * Scope pour obtenir les formations par domaine (via mention).
     */
    public function scopeParDomaine($query, $domaineId)
    {
        return $query->whereHas('mention', function ($q) use ($domaineId) {
            $q->where('domaine_id', $domaineId);
        });
    }

    /**
     * Scope pour obtenir les formations par mention.
     */
    public function scopeParMention($query, $mentionId)
    {
        return $query->where('mention_id', $mentionId);
    }

    /**
     * Scope pour obtenir les formations par diplôme.
     */
    public function scopeParDiplome($query, $diplome)
    {
        return $query->where('diplome', $diplome);
    }

    /**
     * Accessor pour vérifier si la formation est principale.
     */
    public function getEstPrincipaleAttribute(): bool
    {
        return $this->type_formation === self::TYPE_PRINCIPALE;
    }

    /**
     * Accessor pour vérifier si la formation est modulaire.
     */
    public function getEstModulaireAttribute(): bool
    {
        return $this->type_formation === self::TYPE_MODULAIRE;
    }

    /**
     * Accessor pour vérifier si la formation est active.
     */
    public function getEstActiveAttribute(): bool
    {
        return $this->statut_formation === self::STATUT_ACTIVE;
    }

    /**
     * Accessor pour obtenir le domaine via la mention (pour formations principales).
     */
    public function getDomaineAttribute()
    {
        return $this->mention?->domaine;
    }

    /**
     * Obtenir l'offre de formation pour l'année académique actuelle.
     */
    public function offreActuelle()
    {
        return $this->hasOne(OffreFormation::class, 'formation_id')
            ->whereHas('anneeAcademique', function ($query) {
                $query->where('est_actuelle', true);
            });
    }

    /**
     * Boot method pour gérer les événements du modèle.
     */
    protected static function boot()
    {
        parent::boot();

        // Validation avant sauvegarde
        static::saving(function ($formation) {
            // Une formation principale DOIT avoir une mention
            if ($formation->type_formation === self::TYPE_PRINCIPALE && !$formation->mention_id) {
                throw new \InvalidArgumentException(
                    'Une formation principale doit avoir une mention associée.'
                );
            }

            // Une formation modulaire NE DOIT PAS avoir de mention
            if ($formation->type_formation === self::TYPE_MODULAIRE && $formation->mention_id) {
                $formation->mention_id = null;
            }
        });
    }
}