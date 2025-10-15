<?php

// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    // Merge legacy and new columns so model works with existing and new schema
    protected $fillable = [
        'user_id',
        // Legacy columns
        'plan_name', 'description', 'price', 'billing_cycle', 'auto_renew', 'starts_at', 'ends_at', 'cancelled_at',
        // Current implementation columns
        'amount', 'status', 'next_payment_date', 'next_billing_date',
        // Common
        'razorpay_subscription_id', 'razorpay_plan_id', 'payment_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'auto_renew' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'next_payment_date' => 'datetime',
            'next_billing_date' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the subscription.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the payments for the subscription.
     */
    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }
}
