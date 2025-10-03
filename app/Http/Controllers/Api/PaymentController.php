<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class PaymentController extends Controller
{
    private $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(
            config('services.razorpay.key_id'),
            config('services.razorpay.key_secret')
        );
    }

    /**
     * Create Razorpay order for subscription
     */
    public function createSubscriptionOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subscription_id' => 'required|exists:subscriptions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $subscription = Subscription::findOrFail($request->subscription_id);
        $user = $request->user();

        if ($subscription->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $order = $this->razorpay->order->create([
                'amount' => $subscription->price * 100, // Convert to paise
                'currency' => 'INR',
                'receipt' => 'sub_' . $subscription->id,
                'notes' => [
                    'subscription_id' => $subscription->id,
                    'user_id' => $user->id,
                ]
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'order_id' => $order['id'],
                    'amount' => $subscription->price,
                    'currency' => 'INR',
                    'key_id' => config('services.razorpay.key_id'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create Razorpay order for consultation
     */
    public function createConsultationOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = Appointment::findOrFail($request->appointment_id);
        $user = $request->user();

        if ($appointment->patient_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $order = $this->razorpay->order->create([
                'amount' => $appointment->consultation_fee * 100, // Convert to paise
                'currency' => 'INR',
                'receipt' => 'appt_' . $appointment->id,
                'notes' => [
                    'appointment_id' => $appointment->id,
                    'user_id' => $user->id,
                ]
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'order_id' => $order['id'],
                    'amount' => $appointment->consultation_fee,
                    'currency' => 'INR',
                    'key_id' => config('services.razorpay.key_id'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify payment and update records
     */
    public function verifyPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
            'type' => 'required|in:subscription,consultation',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature,
            ];

            $this->razorpay->utility->verifyPaymentSignature($attributes);

            // Get order details
            $order = $this->razorpay->order->fetch($request->razorpay_order_id);
            $receipt = $order['receipt'];
            $amount = $order['amount'] / 100; // Convert from paise

            // Determine payable type and ID
            if ($request->type === 'subscription') {
                $subscriptionId = str_replace('sub_', '', $receipt);
                $subscription = Subscription::findOrFail($subscriptionId);
                $payable = $subscription;
            } else {
                $appointmentId = str_replace('appt_', '', $receipt);
                $appointment = Appointment::findOrFail($appointmentId);
                $payable = $appointment;
            }

            // Create payment record
            $payment = Payment::create([
                'user_id' => $request->user()->id,
                'payable_type' => get_class($payable),
                'payable_id' => $payable->id,
                'type' => $request->type,
                'amount' => $amount,
                'currency' => 'INR',
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_order_id' => $request->razorpay_order_id,
                'status' => 'completed',
                'razorpay_response' => $attributes,
                'paid_at' => now(),
            ]);

            // Update related records
            if ($request->type === 'subscription') {
                $subscription->update([
                    'status' => 'active',
                    'starts_at' => now(),
                    'ends_at' => now()->addMonth(), // Assuming monthly subscription
                ]);
            } else {
                $appointment->update([
                    'is_paid' => true,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully',
                'data' => $payment
            ]);

        } catch (SignatureVerificationError $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: Invalid signature'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment history for user
     */
    public function getPaymentHistory(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->with('payable')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }
}
