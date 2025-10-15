<?php

// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HairLossQuizResponse extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'question_id',
        'answer',
    ];

    /**
     * Get the user that owns the quiz response.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the question that owns the quiz response.
     */
    public function question()
    {
        return $this->belongsTo(HairLossQuizQuestion::class, 'question_id');
    }
}
