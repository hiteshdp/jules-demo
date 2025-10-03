<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'date_of_birth',
        'gender',
        'profile_image',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the patient profile associated with the user.
     */
    public function patientProfile()
    {
        return $this->hasOne(PatientProfile::class);
    }

    /**
     * Get the dermatologist profile associated with the user.
     */
    public function dermatologistProfile()
    {
        return $this->hasOne(Dermatologist::class);
    }

    /**
     * Get the quiz responses for the user.
     */
    public function quizResponses()
    {
        return $this->hasMany(HairLossQuizResponse::class);
    }

    /**
     * Get the subscriptions for the user.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the appointments where user is a patient.
     */
    public function patientAppointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    /**
     * Get the appointments where user is a dermatologist.
     */
    public function dermatologistAppointments()
    {
        return $this->hasMany(Appointment::class, 'dermatologist_id');
    }

    /**
     * Get the payments for the user.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the notifications for the user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Check if user is a patient.
     */
    public function isPatient()
    {
        return $this->role === 'patient';
    }

    /**
     * Check if user is a dermatologist.
     */
    public function isDermatologist()
    {
        return $this->role === 'dermatologist';
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
