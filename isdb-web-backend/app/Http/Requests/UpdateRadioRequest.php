<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRadioRequest extends FormRequest
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
            'nom' => ['sometimes', 'required', 'string', 'max:100'],
            'url_stream' => ['sometimes', 'required', 'url', 'max:500'],
            'image' => ['nullable', 'string'], // URL de l'image
            'en_direct' => ['boolean'],
            'description' => ['nullable', 'string'],
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
            'nom.required' => 'Le nom de la radio est obligatoire.',
            'nom.max' => 'Le nom ne peut pas dépasser 100 caractères.',
            'url_stream.required' => 'L\'URL du flux est obligatoire.',
            'url_stream.url' => 'L\'URL du flux doit être une URL valide.',
        ];
    }
}