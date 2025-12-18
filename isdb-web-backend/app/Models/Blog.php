<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'titre',
        'resume',
        'contenu',
        'cover_image',
        'redacteur_id',
        'statut',
        'date_creation',
        'date_modification',
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'date_modification' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->titre);
            }
            
            if (!$blog->date_creation) {
                $blog->date_creation = now();
            }
        });

        static::updating(function ($blog) {
            $blog->date_modification = now();
        });
    }

    // Relations
    public function redacteur()
    {
        return $this->belongsTo(redacteur::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_tag');
    }

    // Scopes
    public function scopePublie($query)
    {
        return $query->where('statut', 'publie');
    }

    public function scopeBrouillon($query)
    {
        return $query->where('statut', 'brouillon');
    }

    public function scopeWithTag($query, $tagSlug)
    {
        return $query->whereHas('tags', function ($q) use ($tagSlug) {
            $q->where('slug', $tagSlug);
        });
    }

    // Accesseurs
    public function getDateCreationFormatteeAttribute()
    {
        return $this->date_creation->format('d/m/Y');
    }

    public function getDateModificationFormatteeAttribute()
    {
        return $this->date_modification->format('d/m/Y');
    }
}
