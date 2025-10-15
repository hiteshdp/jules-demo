<?php

// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dermatologist extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'license_number',
        'specialization',
        'years_of_experience',
        'qualifications',
        'bio',
        'consultation_fee',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'consultation_fee' => 'decimal:2',
        ];
    }

    /**
     * Get the user that owns the dermatologist profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appointments for the dermatologist.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'dermatologist_id');
    }
}
