<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMentionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titre' => [
                'required', 
                'string', 
                'max:150',
                // Ignorer les mentions soft deleted
                Rule::unique('mentions', 'titre')->whereNull('deleted_at'),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'domaine_id' => ['required', 'integer', 'exists:domaines,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titre.required' => 'Le titre de la mention est obligatoire.',
            'titre.max' => 'Le titre de la mention ne peut pas dépasser 150 caractères.',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',
            'domaine_id.required' => 'Le domaine est obligatoire.',
            'domaine_id.exists' => 'Le domaine sélectionné n\'existe pas.',
        ];
    }
}