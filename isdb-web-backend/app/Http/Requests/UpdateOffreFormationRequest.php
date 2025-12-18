<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOffreFormationRequest extends FormRequest
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
            'formation_id' => ['sometimes', 'required', 'integer', 'exists:formations,id'],
            'annee_academique_id' => ['sometimes', 'required', 'integer', 'exists:annees_academiques,id'],
            'chef_parcours' => ['nullable', 'string', 'max:150'],
            'animateur' => ['nullable', 'string', 'max:150'],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date'],
            'place_limited' => ['nullable', 'integer', 'min:0'],
            'prix' => ['nullable', 'numeric', 'min:0'],
            'est_dispensee' => ['boolean'],
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
            'formation_id.required' => 'La formation est obligatoire.',
            'formation_id.exists' => 'La formation sélectionnée n\'existe pas.',
            
            'annee_academique_id.required' => 'L\'année académique est obligatoire.',
            'annee_academique_id.exists' => 'L\'année académique sélectionnée n\'existe pas.',
            
            'chef_parcours.max' => 'Le nom du chef de parcours ne peut pas dépasser 150 caractères.',
            'animateur.max' => 'Le nom de l\'animateur ne peut pas dépasser 150 caractères.',
            
            'date_debut.date' => 'La date de début doit être une date valide.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            
            'place_limited.integer' => 'Le nombre de places doit être un nombre entier.',
            'place_limited.min' => 'Le nombre de places ne peut pas être négatif.',
            
            'prix.numeric' => 'Le prix doit être un nombre.',
            'prix.min' => 'Le prix ne peut pas être négatif.',
            
            'est_dispensee.boolean' => 'Le champ est_dispensee doit être vrai ou faux.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Vérifier date_fin > date_debut si les deux sont fournis
            if ($this->has('date_debut') && $this->has('date_fin')) {
                if (strtotime($this->date_fin) <= strtotime($this->date_debut)) {
                    $validator->errors()->add('date_fin', 'La date de fin doit être après la date de début.');
                }
            }
            
            // Vérifier qu'une offre n'existe pas déjà pour cette formation et cette année (sauf l'actuelle)
            if ($this->has('formation_id') && $this->has('annee_academique_id')) {
                $offreId = $this->route('offre_formation');
                
                $exists = \App\Models\OffreFormation::where('formation_id', $this->formation_id)
                    ->where('annee_academique_id', $this->annee_academique_id)
                    ->where('id', '!=', $offreId)
                    ->exists();
                
                if ($exists) {
                    $validator->errors()->add('formation_id', 'Cette formation est déjà offerte pour cette année académique.');
                }
            }
        });
    }
}