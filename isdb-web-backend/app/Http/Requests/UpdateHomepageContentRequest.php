<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomepageContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'hero_title' => ['sometimes', 'required', 'string', 'max:255'],
            'hero_highlight' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'string', 'max:255'],
            'hero_cta_primary_label' => ['nullable', 'string', 'max:100'],
            'hero_cta_primary_url' => ['nullable', 'string', 'max:255'],
            'hero_cta_secondary_label' => ['nullable', 'string', 'max:100'],
            'hero_cta_secondary_url' => ['nullable', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'stats' => ['nullable', 'array'],
            'stats.*.value' => ['required_with:stats', 'string', 'max:50'],
            'stats.*.label' => ['required_with:stats', 'string', 'max:100'],
            'features_title' => ['nullable', 'string', 'max:255'],
            'features_description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'formations_section_title' => ['nullable', 'string', 'max:255'],
            'formations_section_description' => ['nullable', 'string'],
            'cta_title' => ['nullable', 'string', 'max:255'],
            'cta_description' => ['nullable', 'string'],
            'cta_button_label' => ['nullable', 'string', 'max:100'],
            'cta_button_url' => ['nullable', 'string', 'max:255'],
        ];
    }
}
