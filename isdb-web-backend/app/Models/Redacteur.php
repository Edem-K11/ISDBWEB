<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Redacteur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes; // Vérifier que HasApiTokens est présent

    protected $table = 'redacteurs'; // IMPORTANT : Spécifier le nom de la table

    protected $fillable = [
        'nom',
        'email',
        'password',
        'avatar',
        'bio',
        'role',
        'est_actif',
        'est_systeme',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'est_actif' => 'boolean',
        'est_systeme' => 'boolean',
        'password' => 'hashed',
    ];

    // Relation: Un redacteur a plusieurs blogs
    public function blogs()
    {
        return $this->hasMany(Blog::class, 'redacteur_id');
    }
    
     // Vérifier si le redacteur est admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Vérifier si le redacteur peut modifier un blog
    public function canEditBlog(Blog $blog): bool
    {
        return $this->isAdmin() || $this->id === $blog->redacteur_id;
    }

    // Compter le nombre de blogs publiés
    public function getBlogsPubliesCountAttribute()
    {
        return $this->blogs()->where('statut', 'publie')->count();
    }
}
