<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'payable_type',
        'payable_id',
        'type',
        'amount',
        'currency',
        'razorpay_payment_id',
        'razorpay_order_id',
        'status',
        'failure_reason',
        'razorpay_response',
        'paid_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'razorpay_response' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the payment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the payable model (subscription or appointment).
     */
    public function payable()
    {
        return $this->morphTo();
    }
}
