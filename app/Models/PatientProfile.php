<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'medical_history',
        'allergies',
        'current_medications',
        'lifestyle',
        'smoking',
        'alcohol_consumption',
        'dietary_habits',
        'stress_level',
        'sleep_pattern',
        'hair_care_routine',
        'family_history',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'smoking' => 'boolean',
            'alcohol_consumption' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the patient profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
