<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RedacteurResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'role' => $this->role,
            'est_actif' => $this->est_actif,
            'blogsPubliesCount' => $this->blogs_publies_count,
        ];
    }
}
