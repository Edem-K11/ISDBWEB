<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MentionResource extends JsonResource
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
            'titre' => $this->titre,
            'description' => $this->description,
            'domaine_id' => $this->domaine_id,
            
            // Relations conditionnelles
            'domaine' => new DomaineResource($this->whenLoaded('domaine')),
            'formations' => FormationResource::collection($this->whenLoaded('formations')),
            
            // Accessors
            'nom_complet' => $this->when(
                $this->relationLoaded('domaine'),
                $this->nom_complet
            ),
            'nombre_formations' => $this->when($this->relationLoaded('formations'), function () {
                return $this->formations->count();
            }),
            
            // Métadonnées
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}