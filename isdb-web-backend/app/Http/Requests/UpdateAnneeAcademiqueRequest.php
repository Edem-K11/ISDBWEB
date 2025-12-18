<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAnneeAcademiqueRequest extends FormRequest
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
        $anneeId = $this->route('annee_academique');

        return [
            'annee_debut' => [
                'sometimes',
                'required',
                'integer',
                'min:2000',
                'max:2100',
                Rule::unique('annees_academiques')->where(function ($query) {
                    return $query->where('annee_fin', $this->annee_fin ?? $this->route('annee_academique')->annee_fin);
                })->ignore($anneeId)
            ],
            'annee_fin' => [
                'sometimes',
                'required',
                'integer',
                'min:2000',
                'max:2100',
            ],
            'date_debut' => ['sometimes', 'required', 'date'],
            'date_fin' => ['sometimes', 'required', 'date'],
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
            
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_debut.date' => 'La date de début doit être une date valide.',
            
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            
            'est_actuelle.boolean' => 'Le champ est_actuelle doit être vrai ou faux.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Vérifier que annee_fin > annee_debut si les deux sont fournis
            if ($this->has('annee_debut') && $this->has('annee_fin')) {
                if ($this->annee_fin <= $this->annee_debut) {
                    $validator->errors()->add('annee_fin', 'L\'année de fin doit être supérieure à l\'année de début.');
                }
            }
            
            // Vérifier que date_fin > date_debut si les deux sont fournis
            if ($this->has('date_debut') && $this->has('date_fin')) {
                if (strtotime($this->date_fin) <= strtotime($this->date_debut)) {
                    $validator->errors()->add('date_fin', 'La date de fin doit être après la date de début.');
                }
            }
        });
    }
}