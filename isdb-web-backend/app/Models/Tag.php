<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'slug',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($tag) {
            if (!$tag->slug) {
                $tag->slug = Str::slug($tag->nom);
            }
        });
    }

    // Relation: Un tag appartient à plusieurs blogs
    public function blogs()
    {
        return $this->belongsToMany(Blog::class, 'blog_tag');
    }

    // Compter le nombre de blogs avec ce tag
    public function getBlogsCountAttribute()
    {
        return $this->blogs()->where('statut', 'publie')->count();
    }
}

