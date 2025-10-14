<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'appointment_id',
        'sender_id',
        'message',
        'attachment',
        'type',
        'is_read',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    /**
     * Get the appointment that owns the chat message.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the sender that owns the chat message.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the full URL to the attachment.
     *
     * @return string|null
     */
    public function getAttachmentUrlAttribute()
    {
        if (!$this->attachment) {
            return null;
        }

        // If it's already a full URL, return it as is
        if (str_starts_with($this->attachment, 'http')) {
            return $this->attachment;
        }

        // If it starts with 'storage/', use it directly
        if (str_starts_with($this->attachment, 'storage/')) {
            return asset($this->attachment);
        }

        // Otherwise, prepend 'storage/' and create full URL
        return asset('storage/' . $this->attachment);
    }
}
