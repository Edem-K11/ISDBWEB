<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRedacteurRequest extends FormRequest
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
        'nom' => 'sometimes|string|max:255',
        'email' => [
            'sometimes',
            'email',
            Rule::unique('redacteurs', 'email')->ignore($this->route('redacteur'))
        ],
        'avatar' => 'nullable|string',
        'bio' => 'nullable|string',
        'password' => 'sometimes|string|min:8',
        'est_actif' => 'sometimes|boolean',
    ];
    }
}
