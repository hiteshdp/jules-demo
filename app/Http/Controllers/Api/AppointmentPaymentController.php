<?php

// Generated via prompt: prompts/appointment_payment_integration_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\Appointment;
use App\Models\AppointmentPayment;
use App\Models\Dermatologist;
use App\Services\RazorpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *   name="Appointment Payment",
 *   description="Razorpay payment APIs for appointment booking"
 * )
 */
class AppointmentPaymentController extends Controller
{
    public function __construct(private RazorpayService $razorpay) {}

    /**
     * Create Razorpay order for appointment payment
     *
     * @OA\Post(
     *   path="/patient/appointment/payment/create",
     *   tags={"Appointment Payment"},
     *   security={{"sanctum": {}}},
     *   summary="Create payment order for appointment",
     *
     *   @OA\RequestBody(
     *     required=true,
     *
     *     @OA\JsonContent(
     *       required={"dermatologist_id","scheduled_at"},
     *
     *       @OA\Property(property="dermatologist_id", type="integer", example=1),
     *       @OA\Property(property="scheduled_at", type="string", format="date-time", example="2025-10-15T10:00:00Z")
     *     )
     *   ),
     *
     *   @OA\Response(
     *     response=200,
     *     description="Payment order created",
     *
     *     @OA\JsonContent(
     *
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="Payment order created"),
     *       @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(property="key", type="string", example="rzp_test_xxxxx"),
     *         @OA\Property(property="order_id", type="string", example="order_123456789"),
     *         @OA\Property(property="amount", type="integer", example=100000),
     *         @OA\Property(property="currency", type="string", example="INR"),
     *         @OA\Property(property="appointment_id", type="integer", example=1)
     *       )
     *     )
     *   )
     * )
     */
    public function createPayment(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'dermatologist_id' => 'required|exists:dermatologists,user_id',
            'scheduled_at' => 'required|date|after:now',
        ]);

        try {
            // Get dermatologist details
            $dermatologist = Dermatologist::where('user_id', $request->dermatologist_id)->first();
            if (! $dermatologist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dermatologist not found',
                ], 404);
            }

            // Create Razorpay order first (without creating appointment)
            $amount = $dermatologist->consultation_fee * 100; // Convert to paise
            $order = $this->razorpay->createOrder($amount, 'INR', [
                'receipt' => 'appointment_pending_'.time(),
                'notes' => [
                    'patient_id' => $user->id,
                    'dermatologist_id' => $request->dermatologist_id,
                    'scheduled_at' => $request->scheduled_at,
                    'consultation_fee' => $dermatologist->consultation_fee,
                ],
                // Restrict payment methods to only cards
                'method' => 'card',
            ]);

            // Create payment record (without appointment_id)
            $payment = AppointmentPayment::create([
                'appointment_id' => null, // Will be set after successful payment
                'user_id' => $user->id,
                'amount' => $dermatologist->consultation_fee,
                'currency' => 'INR',
                'razorpay_order_id' => $order['id'],
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment order created',
                'data' => [
                    'key' => config('services.razorpay.key_id'),
                    'order_id' => $order['id'],
                    'amount' => $amount,
                    'currency' => 'INR',
                    'payment_id' => $payment->id,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to create payment order',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Verify Razorpay payment for appointment
     *
     * @OA\Post(
     *   path="/patient/appointment/payment/verify",
     *   tags={"Appointment Payment"},
     *   security={{"sanctum": {}}},
     *   summary="Verify appointment payment",
     *
     *   @OA\RequestBody(
     *     required=true,
     *
     *     @OA\JsonContent(
     *       required={"razorpay_payment_id","razorpay_order_id","razorpay_signature","payment_id"},
     *
     *       @OA\Property(property="razorpay_payment_id", type="string", example="pay_29QQoUBi66xm2f"),
     *       @OA\Property(property="razorpay_order_id", type="string", example="order_00000000000001"),
     *       @OA\Property(property="razorpay_signature", type="string", example="generated_signature_here"),
     *       @OA\Property(property="payment_id", type="integer", example=1)
     *     )
     *   ),
     *
     *   @OA\Response(
     *     response=200,
     *     description="Payment verified and appointment created",
     *
     *     @OA\JsonContent(
     *
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="Payment verified and appointment created"),
     *       @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(property="appointment_id", type="integer", example=1)
     *       )
     *     )
     *   ),
     *
     *   @OA\Response(
     *     response=422,
     *     description="Invalid signature",
     *
     *     @OA\JsonContent(
     *
     *       @OA\Property(property="success", type="boolean", example=false),
     *       @OA\Property(property="message", type="string", example="Invalid signature")
     *     )
     *   )
     * )
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $attributes = $request->only([
            'razorpay_payment_id',
            'razorpay_order_id',
            'razorpay_signature',
        ]);

        $isValid = $this->razorpay->verifyPaymentSignature($attributes);

        if (! $isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature',
            ], 422);
        }

        try {
            // Get payment record
            $appointmentPayment = AppointmentPayment::where('razorpay_order_id', $request->razorpay_order_id)->first();

            if (! $appointmentPayment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment record not found',
                ], 404);
            }

            // Get appointment details from payment notes (stored in Razorpay order)
            $order = $this->razorpay->getOrder($request->razorpay_order_id);
            $notes = $order['notes'] ?? [];

            // Determine platform commission percentage (create default if missing)
            $platformCommissionPercentage = AdminSetting::getValue('platform_commission_percentage');
            if ($platformCommissionPercentage === null) {
                AdminSetting::setValue('platform_commission_percentage', '0', 'number', 'Platform commission percentage for consultations');
                $platformCommissionPercentage = 0;
            }

            $consultationFee = (float) $appointmentPayment->amount;
            $platformFeeAmount = round($consultationFee * ((float) $platformCommissionPercentage / 100), 2);
            $dermatologistFeeAmount = round($consultationFee - $platformFeeAmount, 2);

            // Create appointment after successful payment
            $appointment = Appointment::create([
                'patient_id' => $appointmentPayment->user_id,
                'dermatologist_id' => $notes['dermatologist_id'],
                'scheduled_at' => $notes['scheduled_at'],
                'consultation_fee' => $appointmentPayment->amount,
                'platform_fee' => $platformFeeAmount,
                'dermatologist_fee' => $dermatologistFeeAmount,
                'is_paid' => true,
            ]);

            // Update payment record with appointment_id
            $appointmentPayment->update([
                'appointment_id' => $appointment->id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'status' => 'paid',
                'paid_at' => now(),
                'razorpay_response' => $attributes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified and appointment created',
                'data' => [
                    'appointment_id' => $appointment->id,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify payment: '.$e->getMessage(),
            ], 400);
        }
    }
}
