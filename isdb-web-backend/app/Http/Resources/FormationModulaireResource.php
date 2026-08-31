<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormationModulaireResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'slug' => $this->slug,
            'description' => $this->description,
            'contenu' => $this->contenu,
            'condition_admission' => $this->condition_admission,
            'objectifs' => $this->objectifs,
            'competences_visees' => $this->competences_visees,
            'debouches' => $this->debouches,
            'profile_sortie' => $this->profile_sortie,
            'evaluation' => $this->evaluation,
            'programme' => $this->programme,
            'programme_pdf' => $this->programme_pdf ? url('storage/' . $this->programme_pdf) : null,
            'duree_heures' => $this->duree_heures,
            'frais_inscription' => $this->frais_inscription,
            'frais_formation' => $this->frais_formation,
            'statut_formation' => $this->statut_formation,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
