<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RazorpayLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'event',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}


