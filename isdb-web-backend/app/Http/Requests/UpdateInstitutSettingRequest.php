<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInstitutSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'logo' => ['nullable', 'string', 'max:255'],
            'galerie' => ['nullable', 'array'],
            'galerie.*' => ['string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'adresse' => ['nullable', 'string', 'max:500'],
            'maps_url' => ['nullable', 'string', 'max:5000'],
            'telephone' => ['nullable', 'string', 'max:50'],
            'telephone_2' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'email_2' => ['nullable', 'email', 'max:255'],
            'fax' => ['nullable', 'string', 'max:50'],
            'site_web' => ['nullable', 'url', 'max:2048'],
            'date_ouverture_inscriptions' => ['nullable', 'date'],
            'date_cloture_inscriptions' => ['nullable', 'date', 'after_or_equal:date_ouverture_inscriptions'],
            'date_rentree' => ['nullable', 'date'],
            'facebook_url' => ['nullable', 'url', 'max:2048'],
            'twitter_url' => ['nullable', 'url', 'max:2048'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'youtube_url' => ['nullable', 'url', 'max:2048'],
            'tiktok_url' => ['nullable', 'url', 'max:2048'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
        ];
    }
}
