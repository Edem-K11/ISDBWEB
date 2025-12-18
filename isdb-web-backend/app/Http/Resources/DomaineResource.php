<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DomaineResource extends JsonResource
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
            
            // Relations conditionnelles
            'mentions' => MentionResource::collection($this->whenLoaded('mentions')),
            
            // Utiliser withCount au lieu de relationLoaded pour les compteurs
            'nombreMentions' => $this->when(isset($this->mentions_count), $this->mentions_count),
            'nombreFormations' => $this->when(isset($this->formations_count), $this->formations_count),
            
            // Métadonnées
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}