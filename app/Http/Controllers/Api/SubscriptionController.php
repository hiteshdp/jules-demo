<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\RazorpayService;
use App\Models\Subscription;

/**
 * @OA\Tag(
 *   name="Subscription",
 *   description="Razorpay subscription APIs for patients"
 * )
 */
class SubscriptionController extends Controller
{
    public function __construct(private RazorpayService $razorpay)
    {
    }

    /**
     * Create a Razorpay plan and subscription
     *
     * @OA\Post(
     *   path="/patient/subscription/create",
     *   tags={"Subscription"},
     *   security={{"sanctum": {}}},
     *   summary="Create subscription (₹500/month)",
     *   @OA\Response(
     *     response=200,
     *     description="Subscription created",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="Subscription created"),
     *       @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(property="key", type="string", example="rzp_test_xxxxx"),
     *         @OA\Property(property="subscription_id", type="string", example="sub_123456789")
     *       )
     *     )
     *   )
     * )
     */
    public function createSubscription(Request $request)
    {
        $user = Auth::user();
        try {
            $amount = 50000; // 500 INR in paise
            $plan = $this->razorpay->createPlan($amount, 'Monthly Subscription');
            $subscription = $this->razorpay->createSubscription($plan['id']);

            // Persist using existing schema (price/billing_cycle) to avoid column errors
            Subscription::create([
                'user_id' => $user->id,
                'razorpay_plan_id' => $plan['id'],
                'razorpay_subscription_id' => $subscription['id'],
                'plan_name' => 'Monthly Subscription',
                'description' => 'Auto created via API',
                'price' => $amount / 100, // store in INR as decimal
                'billing_cycle' => 'monthly',
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Subscription created',
                'data' => [
                    'key' => config('services.razorpay.key_id'),
                    'subscription_id' => $subscription['id'],
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to create subscription',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Verify Razorpay subscription payment signature
     *
     * @OA\Post(
     *   path="/patient/subscription/verify",
     *   tags={"Subscription"},
     *   security={{"sanctum": {}}},
     *   summary="Verify subscription payment signature",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"razorpay_payment_id","razorpay_subscription_id","razorpay_signature"},
     *       @OA\Property(property="razorpay_payment_id", type="string", example="pay_29QQoUBi66xm2f"),
     *       @OA\Property(property="razorpay_subscription_id", type="string", example="sub_00000000000001"),
     *       @OA\Property(property="razorpay_signature", type="string", example="generated_signature_here")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Subscription activated",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="Subscription activated")
     *     )
     *   ),
     *   @OA\Response(
     *     response=422,
     *     description="Invalid signature",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=false),
     *       @OA\Property(property="message", type="string", example="Invalid signature")
     *     )
     *   )
     * )
     */
    public function verifyPayment(Request $request)
    {
        $attributes = $request->only([
            'razorpay_payment_id',
            'razorpay_subscription_id',
            'razorpay_signature',
        ]);

        $isValid = $this->razorpay->verifyPaymentSignature($attributes);

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature',
            ], 422);
        }

        // Calculate dates
        $startDate = now();
        $endDate = now()->addMonth();
        $nextBillingDate = now()->addMonth();
        
        Subscription::where('razorpay_subscription_id', $attributes['razorpay_subscription_id'])
            ->update([
                'status' => 'active',
                'payment_id' => $attributes['razorpay_payment_id'],
                'next_billing_date' => $nextBillingDate,
                'starts_at' => $startDate,
                'ends_at' => $endDate
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription activated',
        ]);
    }

    /**
     * Get current user's latest subscription status
     *
     * @OA\Get(
     *   path="/patient/subscription/status",
     *   tags={"Subscription"},
     *   security={{"sanctum": {}}},
     *   summary="Get subscription status",
     *   @OA\Response(
     *     response=200,
     *     description="Status fetched",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="data", type="object",
     *         nullable=true,
     *         @OA\Property(property="status", type="string", example="active"),
     *         @OA\Property(property="amount", type="integer", example=50000),
     *         @OA\Property(property="razorpay_subscription_id", type="string", example="sub_123"),
     *         @OA\Property(property="payment_id", type="string", example="pay_29QQoUBi66xm2f"),
     *         @OA\Property(property="next_payment_date", type="string", format="date-time", example="2025-10-31T10:00:00Z"),
     *         @OA\Property(property="next_billing_date", type="string", format="date-time", example="2025-11-08T10:00:00Z"),
     *         @OA\Property(property="starts_at", type="string", format="date-time", example="2025-10-08T10:00:00Z"),
     *         @OA\Property(property="ends_at", type="string", format="date-time", example="2025-11-08T10:00:00Z")
     *       )
     *     )
     *   )
     * )
     */
    public function status()
    {
        $userId = Auth::id();
        $sub = Subscription::where('user_id', $userId)->latest()->first();
        return response()->json([
            'success' => true,
            'data' => $sub,
        ]);
    }

    /**
     * Cancel current user's subscription (both local and Razorpay)
     *
     * @OA\Post(
     *   path="/patient/subscription/cancel",
     *   tags={"Subscription"},
     *   security={{"sanctum": {}}},
     *   summary="Cancel subscription",
     *   @OA\Response(
     *     response=200,
     *     description="Cancelled",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="Subscription cancelled successfully")
     *     )
     *   ),
     *   @OA\Response(
     *     response=404,
     *     description="No subscription found"
     *   ),
     *   @OA\Response(
     *     response=400,
     *     description="Failed to cancel subscription"
     *   )
     * )
     */
    public function cancel()
    {
        $userId = Auth::id();
        $sub = Subscription::where('user_id', $userId)->latest()->first();
        
        if (!$sub) {
            return response()->json([
                'success' => false, 
                'message' => 'No subscription found'
            ], 404);
        }

        try {
            // Cancel subscription in Razorpay first
            $razorpayCancelled = $this->razorpay->cancelSubscription($sub->razorpay_subscription_id);
            
            if (!$razorpayCancelled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to cancel subscription in Razorpay. Please try again or contact support.'
                ], 400);
            }

            // Update local database status
            $sub->status = 'cancelled';
            $sub->cancelled_at = now();
            $sub->save();

            return response()->json([
                'success' => true, 
                'message' => 'Subscription cancelled successfully. You will not be charged for future billing cycles.'
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel subscription: ' . $e->getMessage()
            ], 400);
        }
    }
}


