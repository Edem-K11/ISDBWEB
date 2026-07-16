<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'slug' => $this->slug,
            'description' => $this->description,
            'images' => collect($this->images ?? [])->map(
                fn ($image) => str_starts_with($image, 'http') ? $image : asset('storage/' . $image)
            )->values(),
            'ordre' => $this->ordre,
            'lien_radio' => $this->lien_radio,
            'est_actif' => $this->est_actif,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
