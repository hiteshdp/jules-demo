<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Add authorization logic here if needed, for example,
        // ensuring the authenticated user is a patient.
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
            'dermatologist_id' => ['required', 'exists:dermatologists,id'],
            'scheduled_at' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
