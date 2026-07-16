<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hero' => [
                'title' => $this->hero_title,
                'highlight' => $this->hero_highlight,
                'description' => $this->hero_description,
                'image' => $this->hero_image ? asset('storage/' . $this->hero_image) : null,
                'cta_primary' => [
                    'label' => $this->hero_cta_primary_label,
                    'url' => $this->hero_cta_primary_url,
                ],
                'cta_secondary' => [
                    'label' => $this->hero_cta_secondary_label,
                    'url' => $this->hero_cta_secondary_url,
                ],
            ],
            'tagline' => $this->tagline,
            'stats' => $this->stats ?? [],
            'features' => [
                'title' => $this->features_title,
                'description' => $this->features_description,
                'items' => $this->features ?? [],
            ],
            'formations_section' => [
                'title' => $this->formations_section_title,
                'description' => $this->formations_section_description,
            ],
            'cta' => [
                'title' => $this->cta_title,
                'description' => $this->cta_description,
                'button_label' => $this->cta_button_label,
                'button_url' => $this->cta_button_url,
            ],
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
