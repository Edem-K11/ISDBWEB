<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFormationRequest extends FormRequest
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
            'titre' => ['required', 'string', 'max:200'],
            'type_formation' => ['required', Rule::in(['PRINCIPALE', 'MODULAIRE'])],
            'description' => ['nullable', 'string'],
            
            // mention_id est requis si type_formation = PRINCIPALE
            'mention_id' => [
                Rule::requiredIf($this->type_formation === 'PRINCIPALE'),
                'nullable',
                'integer',
                'exists:mentions,id'
            ],
            
            'diplome' => [
                'nullable',
                Rule::in(['LICENCE_PROFESSIONNELLE', 'LICENCE_FONDAMENTALE', 'MASTER', 'CERTIFICAT_MODULE'])
            ],
            
            // Informations pédagogiques
            'condition_admission' => ['nullable', 'string'],
            'profile_intree' => ['nullable', 'string'],
            'specialite' => ['nullable', 'string'],
            'objectifs' => ['nullable', 'string'],
            'profile_sortie' => ['nullable', 'string'],
            'evaluation' => ['nullable', 'string'],
            'programme' => ['nullable', 'string'],
            'programme_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'], // 10MB max
            
            // Informations pratiques
            'duree_formation' => ['nullable', 'string', 'max:50'],
            'frais_scolarite' => ['nullable', 'string'],
            
            'statut_formation' => [
                'nullable',
                Rule::in(['ACTIVE', 'ARCHIVEE', 'SUPPRIMEE'])
            ],
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
            'titre.required' => 'Le titre de la formation est obligatoire.',
            'titre.max' => 'Le titre ne peut pas dépasser 200 caractères.',
            
            'type_formation.required' => 'Le type de formation est obligatoire.',
            'type_formation.in' => 'Le type de formation doit être PRINCIPALE ou MODULAIRE.',
            
            'mention_id.required_if' => 'La mention est obligatoire pour une formation principale.',
            'mention_id.exists' => 'La mention sélectionnée n\'existe pas.',
            
            'diplome.in' => 'Le diplôme doit être LICENCE_PROFESSIONNELLE, LICENCE_FONDAMENTALE ou MASTER.',
            
            'programme_pdf.file' => 'Le programme doit être un fichier.',
            'programme_pdf.mimes' => 'Le programme doit être un fichier PDF.',
            'programme_pdf.max' => 'Le fichier PDF ne peut pas dépasser 10MB.',
            
            'duree_formation.max' => 'La durée de formation ne peut pas dépasser 50 caractères.',
            
            'statut_formation.in' => 'Le statut doit être ACTIVE, ARCHIVEE ou SUPPRIMEE.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Si type_formation = MODULAIRE, mention_id doit être null
            if ($this->type_formation === 'MODULAIRE' && $this->mention_id) {
                $validator->errors()->add('mention_id', 'Une formation modulaire ne peut pas avoir de mention.');
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Si statut_formation n'est pas envoyé, on met ACTIVE par défaut
        if (!$this->has('statut_formation')) {
            $this->merge([
                'statut_formation' => 'ACTIVE',
            ]);
        }
    }
}