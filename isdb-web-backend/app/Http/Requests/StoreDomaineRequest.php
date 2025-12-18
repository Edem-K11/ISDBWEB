<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDomaineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Seuls les admins peuvent créer des domaines
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
            'nom' => [
                'required', 
                'string', 
                'max:100', 
                // Ignorer les domaines soft deleted
                Rule::unique('domaines', 'nom')->whereNull('deleted_at')],
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
            'nom.required' => 'Le nom du domaine est obligatoire.',
            'nom.unique' => 'Ce nom de domaine existe déjà.',
            'nom.max' => 'Le nom du domaine ne peut pas dépasser 100 caractères.',
        ];
    }
}