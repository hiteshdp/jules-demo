<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'patient_id',
        'dermatologist_id',
        'scheduled_at',
        'status',
        'notes',
        'prescription',
        'zoom_link',
        'zoom_meeting_id',
        'consultation_fee',
        'is_paid',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'consultation_fee' => 'decimal:2',
            'is_paid' => 'boolean',
        ];
    }

    /**
     * Normalize Zoom link by ensuring protocol is present when saving.
     */
    public function setZoomLinkAttribute($value): void
    {
        if (empty($value)) {
            $this->attributes['zoom_link'] = null;
            return;
        }

        $link = trim($value);
        if (!preg_match('/^https?:\/\//i', $link)) {
            $link = 'https://' . $link;
        }
        $this->attributes['zoom_link'] = $link;
    }

    /**
     * Get the patient that owns the appointment.
     */
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    /**
     * Get the dermatologist that owns the appointment.
     */
    public function dermatologist()
    {
        return $this->belongsTo(Dermatologist::class, 'dermatologist_id', 'user_id');
    }

    /**
     * Get the chat messages for the appointment.
     */
    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * Get the payments for the appointment.
     */
    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    /**
     * Get the appointment payment for the appointment.
     */
    public function appointmentPayment()
    {
        return $this->hasOne(AppointmentPayment::class);
    }
}
