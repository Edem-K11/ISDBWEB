<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
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
            'titre' => 'required|string|max:255',
            'resume' => 'required|string|max:500',
            'contenu' => 'required|string',
            'cover_image' => 'required|string',
            'redacteur_id' => 'required|exists:redacteurs,id',
            'statut' => 'required|in:brouillon,publie',
            'tags' => 'required|array|min:1',
            'tags.*' => 'exists:tags,id',
        ];
    }

    public function messages(): array
    {
        return [
            'titre.required' => 'Le titre est obligatoire',
            'resume.required' => 'Le résumé est obligatoire',
            'contenu.required' => 'Le contenu est obligatoire',
            'cover_image.required' => 'L\'image de cover est obligatoire',
            'redacteur_id.required' => 'Le rédacteur est obligatoire',
            'redacteur_id.exists' => 'Le rédacteur sélectionné n\'existe pas',
            'tags.required' => 'Au moins un tag est requis',
            'tags.*.exists' => 'Un ou plusieurs tags sont invalides',
        ];
    }
}
