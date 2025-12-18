<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
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
            'slug' => $this->slug,
            'titre' => $this->titre,
            'resume' => $this->resume,
            'contenu' => $this->contenu,
            'coverImage' => $this->cover_image,
            'redacteur' => new RedacteurResource($this->whenLoaded('redacteur')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'dateCreation' => $this->date_creation->format('d/m/Y'),
            'dateModification' => $this->date_modification?->format('d/m/Y'),
            'statut' => $this->statut,
        ];
    }
}
