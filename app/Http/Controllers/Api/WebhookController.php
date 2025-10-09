<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Payment;
use App\Models\RazorpayLog;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\PaymentNotificationService;

/**
 * @OA\Tag(
 *   name="Razorpay Webhook",
 *   description="Webhook endpoint for Razorpay events"
 * )
 */
class WebhookController extends Controller
{
    public function __construct(private PaymentNotificationService $notificationService)
    {
    }
    /**
     * Razorpay webhook handler
     *
     * @OA\Post(
     *   path="/razorpay/webhook",
     *   tags={"Razorpay Webhook"},
     *   summary="Handle Razorpay webhook events",
     *   description="Verifies X-Razorpay-Signature and processes events like subscription.charged, payment.failed, subscription.cancelled",
     *   @OA\RequestBody(
     *     required=true,
     *     description="Razorpay event payload",
     *     @OA\JsonContent()
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Webhook processed",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true)
     *     )
     *   ),
     *   @OA\Response(
     *     response=400,
     *     description="Invalid signature"
     *   )
     * )
     */
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature');

        $secret = config('services.razorpay.webhook_secret');

        if (!$this->verifySignature($payload, $signature, $secret)) {
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 400);
        }

        $data = json_decode($payload, true);

        RazorpayLog::create([
            'event' => $data['event'] ?? 'unknown',
            'payload' => $data,
        ]);

        $event = $data['event'] ?? '';

        if ($event === 'subscription.charged') {
            $subscription = $data['payload']['subscription']['entity'];
            $subId = $subscription['id'];
            $next = $data['payload']['subscription']['entity']['charge_at'] ?? null;
            $payment = $data['payload']['payment']['entity'] ?? null;
            if ($subId) {
                // Mark previous as old
                Subscription::where('razorpay_subscription_id', $subId)
                    ->update(['is_latest' => false]);

                // Insert new cycle record
                Subscription::create([
                    'user_id' => $user_id ?? null,
                    'razorpay_subscription_id' => $subId,
                    'razorpay_payment_id' => $payment['id'] ?? null,
                    'plan_id' => $subscription['plan_id'],
                    'plan_name' => $subscription['plan_name'],
                    'description' => $subscription['description'],
                    'price' => ($payment['amount'] ?? 0) / 100,
                    'billing_cycle' => $subscription['billing_cycle'],
                    'status' => $payment['status'] ?? 'active',
                    'failure_reason' => $payment['error_description'] ?? null,
                    'payment_response' => $data['payload'],
                    'starts_at' => Carbon::parse($subscription['current_start']),
                    'ends_at' => Carbon::parse($subscription['current_end']),
                    'is_latest' => true,
                    'next_payment_date' => $next ? date('Y-m-d H:i:s', $next) : null,
                ]);

				// Send payment success notifications
				$this->notificationService->sendPaymentSuccessNotifications($payment);
            }
        } elseif ($event === 'payment.failed') {
            $payment = $data['payload']['payment']['entity'] ?? null;
            $subId = $payment['subscription_id'] ?? null;

            if ($subId) {
                // Mark previous as old
                Subscription::where('razorpay_subscription_id', $subId)
                    ->update(['is_latest' => false]);

                // Insert new failed record
                Subscription::create([
                    'user_id' => $user_id ?? null,
                    'razorpay_subscription_id' => $subId,
                    'razorpay_payment_id' => $payment['id'] ?? null,
                    'plan_id' => $payment['plan_id'] ?? null,
                    'plan_name' => $payment['notes']['plan_name'] ?? null,
                    'description' => $payment['notes']['description'] ?? null,
                    'price' => ($payment['amount'] ?? 0) / 100,
                    'billing_cycle' => null,
                    'status' => 'failed',
                    'failure_reason' => $payment['error_description'] ?? 'Payment failed',
                    'payment_response' => $data['payload'],
                    'starts_at' => now(),
                    'ends_at' => null,
                    'is_latest' => true,
                    'next_payment_date' => null,
                ]);
            }
        } elseif ($event === 'subscription.cancelled') {
            $subscription = $data['payload']['subscription']['entity'] ?? null;
            $subId = $subscription['id'] ?? null;
        
            if ($subId) {
                // Mark previous as old
                Subscription::where('razorpay_subscription_id', $subId)
                    ->update(['is_latest' => false]);
        
                // Insert cancellation record
                Subscription::create([
                    'user_id' => $user_id ?? null,
                    'razorpay_subscription_id' => $subId,
                    'razorpay_payment_id' => null,
                    'plan_id' => $subscription['plan_id'] ?? null,
                    'plan_name' => $subscription['plan_name'] ?? null,
                    'description' => $subscription['description'] ?? null,
                    'price' => 0,
                    'billing_cycle' => $subscription['billing_cycle'] ?? null,
                    'status' => 'cancelled',
                    'failure_reason' => null,
                    'payment_response' => $data['payload'],
                    'starts_at' => Carbon::parse($subscription['current_start']),
                    'ends_at' => Carbon::parse($subscription['current_end']),
                    'is_latest' => true,
                    'next_payment_date' => null,
                ]);
            }
        
        }

        return response()->json(['success' => true]);
    }

    private function verifySignature(string $payload, ?string $signature, string $secret): bool
    {
        if (!$signature) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        return hash_equals($expectedSignature, $signature);
    }
}


