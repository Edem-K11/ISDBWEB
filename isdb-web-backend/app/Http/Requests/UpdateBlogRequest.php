<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titre' => 'sometimes|string|max:255',
            'resume' => 'sometimes|string|max:500',
            'contenu' => 'sometimes|string',
            'cover_image' => 'sometimes|string',
            'redacteur_id' => 'sometimes|exists:redacteurs,id',
            'statut' => 'sometimes|in:brouillon,publie',
            'tags' => 'sometimes|array|min:1',
            'tags.*' => 'exists:tags,id',
        ];
    }
}
