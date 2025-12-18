<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnneeAcademiqueRequest extends FormRequest
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
            'annee_debut' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
                Rule::unique('annees_academiques')->where(function ($query) {
                    return $query->where('annee_fin', $this->annee_fin);
                })
            ],
            'annee_fin' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
                'gt:annee_debut' // annee_fin doit être > annee_debut
            ],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after:date_debut'],
            'est_actuelle' => ['boolean'],
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
            'annee_debut.required' => 'L\'année de début est obligatoire.',
            'annee_debut.integer' => 'L\'année de début doit être un nombre entier.',
            'annee_debut.min' => 'L\'année de début doit être au minimum 2000.',
            'annee_debut.max' => 'L\'année de début doit être au maximum 2100.',
            'annee_debut.unique' => 'Cette année académique existe déjà.',
            
            'annee_fin.required' => 'L\'année de fin est obligatoire.',
            'annee_fin.integer' => 'L\'année de fin doit être un nombre entier.',
            'annee_fin.min' => 'L\'année de fin doit être au minimum 2000.',
            'annee_fin.max' => 'L\'année de fin doit être au maximum 2100.',
            'annee_fin.gt' => 'L\'année de fin doit être supérieure à l\'année de début.',
            
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_debut.date' => 'La date de début doit être une date valide.',
            
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
            
            'est_actuelle.boolean' => 'Le champ est actuelle doit être vrai ou faux.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Si est_actuelle n'est pas envoyé, on met false par défaut
        if (!$this->has('est_actuelle')) {
            $this->merge([
                'est_actuelle' => false,
            ]);
        }
    }
}