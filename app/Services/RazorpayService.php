<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

namespace App\Services;

use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class RazorpayService
{
    private Api $api;

    public function __construct()
    {
        $this->api = new Api(
            config('services.razorpay.key_id'),
            config('services.razorpay.key_secret')
        );

      
    }

    public function createPlan(int $amount, string $name)
    {
        // amount in paise, monthly period
        return $this->api->plan->create([
            'period' => 'monthly',
            'interval' => 1,
            'item' => [
                'name' => $name,
                'amount' => $amount,
                'currency' => 'INR',
            ],
        ]);
    }

    public function createSubscription(string $planId)
    {
        // Use supported params. customer_notify: 1 sends email to customer; total_count 12 = 12 cycles
        return $this->api->subscription->create([
            'plan_id' => $planId,
            'total_count' => 12,
            'customer_notify' => 1,
        ]);
    }

    public function verifyPaymentSignature(array $attributes): bool
    {
        try {
            $this->api->utility->verifyPaymentSignature($attributes);
            return true;
        } catch (\Throwable $e) {
            Log::warning('Razorpay signature verification failed', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}


