<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OffreFormationResource extends JsonResource
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
            'formation_id' => $this->formation_id,
            'annee_academique_id' => $this->annee_academique_id,
            
            // Informations spécifiques à l'année
            'chef_parcours' => $this->chef_parcours,
            'animateur' => $this->animateur,
            'date_debut' => $this->date_debut?->toDateString(),
            'date_fin' => $this->date_fin?->toDateString(),
            'place_limited' => $this->place_limited,
            'prix' => $this->prix ? number_format($this->prix, 0, ',', ' ') . ' FCFA' : null,
            'prix_brut' => $this->prix, // Pour les calculs
            'est_dispensee' => $this->est_dispensee,
            
            // Accessors
            'est_en_cours' => $this->est_en_cours,
            'est_future' => $this->est_future,
            'est_passee' => $this->est_passee,
            'a_places_disponibles' => $this->a_places_disponibles,
            
            // Relations conditionnelles
            'formation' => new FormationResource($this->whenLoaded('formation')),
            'annee_academique' => new AnneeAcademiqueResource($this->whenLoaded('anneeAcademique')),
            
            // Métadonnées
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}