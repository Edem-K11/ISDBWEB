<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnneeAcademiqueResource extends JsonResource
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
            'annee_debut' => $this->annee_debut,
            'annee_fin' => $this->annee_fin,
            'libelle' => $this->libelle, // Ex: "2024-2025"
            'est_actuelle' => $this->est_actuelle,
            'date_debut' => $this->date_debut?->toDateString(),
            'date_fin' => $this->date_fin?->toDateString(),
            
            // Relations conditionnelles
            'offres_formations' => OffreFormationResource::collection($this->whenLoaded('offresFormations')),
            'nombre_offres' => $this->when($this->relationLoaded('offresFormations'), function () {
                return $this->offresFormations->count();
            }),
            
            // Métadonnées
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}