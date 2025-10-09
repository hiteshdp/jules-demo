<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

namespace App\Http\Controllers\Api;

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
     *   path="/api/razorpay/webhook",
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
            $subId = $data['payload']['subscription']['entity']['id'] ?? null;
            $next = $data['payload']['subscription']['entity']['charge_at'] ?? null;
            $paymentId = $data['payload']['payment']['entity']['id'] ?? null;
            $amount = $data['payload']['payment']['entity']['amount'] ?? null;
            
            if ($subId) {
                $subscription = Subscription::where('razorpay_subscription_id', $subId)->first();
                
                if ($subscription) {
                    $subscription->update([
                        'status' => 'active',
                        'next_payment_date' => $next ? date('Y-m-d H:i:s', $next) : null,
                    ]);

                    // Create payment record for recurring payment
                    if ($paymentId && $amount) {
                        $payment = Payment::create([
                            'user_id' => $subscription->user_id,
                            'payable_type' => Subscription::class,
                            'payable_id' => $subscription->id,
                            'type' => 'subscription',
                            'amount' => $amount / 100, // Convert from paise
                            'currency' => 'INR',
                            'razorpay_payment_id' => $paymentId,
                            'razorpay_order_id' => null,
                            'status' => 'completed',
                            'razorpay_response' => $data,
                            'paid_at' => now(),
                        ]);

                        // Send payment success notifications
                        $this->notificationService->sendPaymentSuccessNotifications($payment);
                    }
                }
            }
        } elseif ($event === 'payment.failed') {
            $subId = $data['payload']['payment']['entity']['subscription_id'] ?? null;
            if ($subId) {
                Subscription::where('razorpay_subscription_id', $subId)
                    ->update(['status' => 'failed']);
            }
        } elseif ($event === 'subscription.cancelled') {
            $subId = $data['payload']['subscription']['entity']['id'] ?? null;
            if ($subId) {
                Subscription::where('razorpay_subscription_id', $subId)
                    ->update(['status' => 'cancelled']);
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


