<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class UpdateAnneeAcademiqueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $currentYear = now()->year;
        $anneeId = $this->route('id');
        
        return [
            'annee_debut' => [
                'required',
                'integer',
                'min:' . ($currentYear - 10),
                'max:' . ($currentYear + 5),
                Rule::unique('annees_academiques')
                    ->ignore($anneeId)
                    ->where(function ($query) {
                        return $query
                            ->where('annee_fin', $this->annee_debut + 1)
                            ->whereNull('deleted_at');
                    })
            ],
            'annee_fin' => [
                'required',
                'integer',
            ],
            'date_debut' => [
                'required',
                'date',
                'before:date_fin'
            ],
            'date_fin' => [
                'required',
                'date',
                'after:date_debut'
            ],
        ];
    }

    public function messages(): array
    {
        $currentYear = now()->year;
        
        return [
            'annee_debut.required' => 'L\'année de début est obligatoire.',
            'annee_debut.integer' => 'L\'année de début doit être un nombre entier.',
            'annee_debut.min' => 'L\'année de début ne peut pas être antérieure à ' . ($currentYear - 10) . '.',
            'annee_debut.max' => 'L\'année de début ne peut pas dépasser ' . ($currentYear + 5) . '.',
            'annee_debut.unique' => 'Cette année académique existe déjà.',
            
            'annee_fin.required' => 'L\'année de fin est obligatoire.',
            'annee_fin.integer' => 'L\'année de fin doit être un nombre entier.',
            
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_debut.date' => 'La date de début doit être une date valide.',
            'date_debut.before' => 'La date de début doit être avant la date de fin.',
            
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            
            // Cohérence date_debut avec annee_debut
            if ($this->date_debut) {
                $dateDebut = Carbon::parse($this->date_debut);
                if ($dateDebut->year != $this->annee_debut) {
                    $validator->errors()->add(
                        'date_debut',
                        "La date de début doit être dans l'année {$this->annee_debut}."
                    );
                }
            }
            
            // Cohérence date_fin avec annee_fin
            if ($this->date_fin) {
                $dateFin = Carbon::parse($this->date_fin);
                $anneeFin = $this->annee_debut + 1;
                
                if ($dateFin->year != $anneeFin) {
                    $validator->errors()->add(
                        'date_fin',
                        "La date de fin doit être dans l'année {$anneeFin}."
                    );
                }
            }
            
            // Durée minimale/maximale
            if ($this->date_debut && $this->date_fin) {
                $debut = Carbon::parse($this->date_debut);
                $fin = Carbon::parse($this->date_fin);
                $dureeEnMois = $debut->diffInMonths($fin);
                
                if ($dureeEnMois < 6) {
                    $validator->errors()->add(
                        'date_fin',
                        'Une année académique doit durer au minimum 6 mois.'
                    );
                }
                
                if ($dureeEnMois > 15) {
                    $validator->errors()->add(
                        'date_fin',
                        'Une année académique ne peut pas durer plus de 15 mois.'
                    );
                }
            }
        });
    }

    protected function prepareForValidation()
    {
        if ($this->has('annee_debut')) {
            $this->merge([
                'annee_fin' => $this->annee_debut + 1
            ]);
        }
    }
}