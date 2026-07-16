<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Studio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'slug',
        'description',
        'images',
        'ordre',
        'lien_radio',
        'est_actif',
    ];

    protected $casts = [
        'images' => 'array',
        'lien_radio' => 'boolean',
        'est_actif' => 'boolean',
        'ordre' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Studio $studio) {
            if (empty($studio->slug)) {
                $baseSlug = Str::slug($studio->nom);
                $slug = $baseSlug;
                $counter = 1;

                while (self::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter++;
                }

                $studio->slug = $slug;
            }
        });
    }

    public function scopeActifs($query)
    {
        return $query->where('est_actif', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('ordre')->orderBy('nom');
    }
}
