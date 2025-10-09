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

    public function cancelSubscription(string $subscriptionId)
    {
        try {
            // Cancel the subscription in Razorpay
            $subscription = $this->api->subscription->fetch($subscriptionId);
            $subscription->cancel();
            
            Log::info('Razorpay subscription cancelled', [
                'subscription_id' => $subscriptionId,
            ]);
            
            return true;
        } catch (\Throwable $e) {
            Log::error('Failed to cancel Razorpay subscription', [
                'subscription_id' => $subscriptionId,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function getSubscription(string $subscriptionId)
    {
        try {
            return $this->api->subscription->fetch($subscriptionId);
        } catch (\Throwable $e) {
            Log::error('Failed to fetch Razorpay subscription', [
                'subscription_id' => $subscriptionId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function createOrder(int $amount, string $currency, array $options = [])
    {
        try {
            $orderData = [
                'amount' => $amount,
                'currency' => $currency,
                'receipt' => $options['receipt'] ?? 'order_' . time(),
            ];

            if (isset($options['notes'])) {
                $orderData['notes'] = $options['notes'];
            }

            return $this->api->order->create($orderData);
        } catch (\Throwable $e) {
            Log::error('Failed to create Razorpay order', [
                'amount' => $amount,
                'currency' => $currency,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function getOrder(string $orderId)
    {
        try {
            return $this->api->order->fetch($orderId);
        } catch (\Throwable $e) {
            Log::error('Failed to fetch Razorpay order', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}


