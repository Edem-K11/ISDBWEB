<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstitutSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'logo' => $this->logo,
            'galerie' => collect($this->galerie ?? [])->map(
                fn ($image) => str_starts_with($image, 'http') ? $image : asset('storage/' . $image)
            )->values(),
            'description' => $this->description,
            'adresse' => $this->adresse,
            'maps_url' => $this->maps_url,
            'telephone' => $this->telephone,
            'telephone_2' => $this->telephone_2,
            'email' => $this->email,
            'email_2' => $this->email_2,
            'fax' => $this->fax,
            'site_web' => $this->site_web,
            'date_ouverture_inscriptions' => $this->date_ouverture_inscriptions?->toDateString(),
            'date_cloture_inscriptions' => $this->date_cloture_inscriptions?->toDateString(),
            'date_rentree' => $this->date_rentree?->toDateString(),
            'reseaux_sociaux' => [
                'facebook' => $this->facebook_url,
                'twitter' => $this->twitter_url,
                'linkedin' => $this->linkedin_url,
                'instagram' => $this->instagram_url,
                'youtube' => $this->youtube_url,
                'tiktok' => $this->tiktok_url,
                'whatsapp' => $this->whatsapp,
            ],
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
