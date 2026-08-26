<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'sujet',
        'message',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function scopeNonLus($query)
    {
        return $query->where('lu', false);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('created_at');
    }
}
