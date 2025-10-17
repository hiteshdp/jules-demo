<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DermatologistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->name, // Alias User's 'name' to 'full_name'
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => $this->created_at->toDateTimeString(),

            // Flatten the profile data, providing defaults if the profile is missing
            'specialization' => $this->dermatologistProfile->specialization ?? null,
            'experience_years' => $this->dermatologistProfile->years_of_experience ?? 0,
            'clinic_name' => $this->dermatologistProfile->clinic_name ?? null,
            'status' => $this->dermatologistProfile->status ?? 'inactive',
        ];
    }
}