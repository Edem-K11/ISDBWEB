<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFormationModulaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:1000'],
            'contenu' => ['nullable', 'string'],
            'condition_admission' => ['nullable', 'string'],
            'objectifs' => ['nullable', 'string'],
            'competences_visees' => ['nullable', 'string'],
            'debouches' => ['nullable', 'string'],
            'profile_sortie' => ['nullable', 'string'],
            'evaluation' => ['nullable', 'string'],
            'programme' => ['nullable', 'string'],
            'programme_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:15360'],
            'duree_heures' => ['nullable', 'integer', 'min:1'],
            'frais_inscription' => ['nullable', 'numeric', 'min:0'],
            'frais_formation' => ['nullable', 'numeric', 'min:0'],
            'statut_formation' => ['nullable', Rule::in(['ACTIVE', 'ARCHIVEE', 'SUPPRIMEE'])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titre.required' => 'Le titre de la formation modulaire est obligatoire.',
            'titre.max' => 'Le titre ne peut pas dépasser 200 caractères.',
            'programme_pdf.mimes' => 'Le programme doit être un fichier PDF.',
            'programme_pdf.max' => 'Le fichier PDF ne peut pas dépasser 15 Mo.',
            'duree_heures.integer' => 'La durée doit être un nombre d\'heures.',
            'frais_inscription.numeric' => 'Les frais d\'inscription doivent être un montant valide.',
            'frais_formation.numeric' => 'Les frais de formation doivent être un montant valide.',
            'statut_formation.in' => 'Le statut doit être ACTIVE, ARCHIVEE ou SUPPRIMEE.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if (!$this->has('statut_formation')) {
            $this->merge(['statut_formation' => 'ACTIVE']);
        }
    }
}
