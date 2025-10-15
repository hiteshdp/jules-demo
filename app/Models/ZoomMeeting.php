<?php

// Generated via prompt: prompts/zoom_meeting_database_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ZoomMeeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'topic',
        'join_url',
        'start_url',
        'password',
        'start_time',
        'duration',
        'appointment_id',
        'dermatologist_id',
        'patient_id',
        'status',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function dermatologist()
    {
        return $this->belongsTo(User::class, 'dermatologist_id');
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function isActive()
    {
        return $this->status === 'started';
    }

    public function isEnded()
    {
        return $this->status === 'ended';
    }
}
