<?php

// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Send email notification
     */
    public function sendEmailNotification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'sometimes|string|in:appointment_reminder,payment_confirmation,quiz_completion,general',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::findOrFail($request->user_id);

        try {
            // Create notification record
            $notification = Notification::create([
                'user_id' => $user->id,
                'type' => 'email',
                'subject' => $request->subject,
                'message' => $request->message,
                'status' => 'pending',
            ]);

            // Send email
            Mail::send('emails.notification', [
                'user' => $user,
                'subject' => $request->subject,
                'message' => $request->message,
            ], function ($mail) use ($user, $request) {
                $mail->to($user->email, $user->name)
                    ->subject($request->subject);
            });

            // Update notification status
            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Email notification sent successfully',
                'data' => $notification,
            ]);

        } catch (\Exception $e) {
            // Update notification status to failed
            $notification->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send email notification: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send appointment reminder
     */
    public function sendAppointmentReminder(Request $request, $appointmentId)
    {
        $appointment = \App\Models\Appointment::with(['patient', 'dermatologist.user'])
            ->findOrFail($appointmentId);

        $patient = $appointment->patient;
        $dermatologist = $appointment->dermatologist->user;

        $subject = 'Appointment Reminder - Hair Skin Health';
        $message = "Dear {$patient->name},\n\n";
        $message .= "This is a reminder for your upcoming appointment:\n\n";
        $message .= 'Date: '.$appointment->scheduled_at->format('M d, Y')."\n";
        $message .= 'Time: '.$appointment->scheduled_at->format('h:i A')."\n";
        $message .= "Dermatologist: Dr. {$dermatologist->name}\n";
        $message .= "Consultation Fee: ₹{$appointment->consultation_fee}\n\n";

        if ($appointment->zoom_link) {
            $message .= "Zoom Link: {$appointment->zoom_link}\n\n";
        }

        $message .= "Please ensure you are available at the scheduled time.\n\n";
        $message .= "Best regards,\nHair Skin Health Team";

        return $this->sendEmailNotification(new Request([
            'user_id' => $patient->id,
            'subject' => $subject,
            'message' => $message,
            'type' => 'appointment_reminder',
        ]));
    }

    /**
     * Send payment confirmation
     */
    public function sendPaymentConfirmation(Request $request, $paymentId)
    {
        $payment = Payment::with('user')->findOrFail($paymentId);

        $subject = 'Payment Confirmation - Hair Skin Health';
        $message = "Dear {$payment->user->name},\n\n";
        $message .= "Your payment has been processed successfully.\n\n";
        $message .= "Payment Details:\n";
        $message .= "Amount: ₹{$payment->amount}\n";
        $message .= 'Type: '.ucfirst($payment->type)."\n";
        $message .= "Payment ID: {$payment->razorpay_payment_id}\n";
        $message .= 'Date: '.$payment->paid_at->format('M d, Y h:i A')."\n\n";
        $message .= "Thank you for your payment.\n\n";
        $message .= "Best regards,\nHair Skin Health Team";

        return $this->sendEmailNotification(new Request([
            'user_id' => $payment->user_id,
            'subject' => $subject,
            'message' => $message,
            'type' => 'payment_confirmation',
        ]));
    }

    /**
     * Send quiz completion notification
     */
    public function sendQuizCompletionNotification(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $subject = 'Quiz Completed - Get Your Recommendations';
        $message = "Dear {$user->name},\n\n";
        $message .= "Thank you for completing the hair loss assessment quiz!\n\n";
        $message .= "Based on your responses, we have prepared personalized recommendations for you.\n";
        $message .= "Please log in to your account to view your customized treatment plan.\n\n";
        $message .= "You can also book a consultation with our dermatologists for professional advice.\n\n";
        $message .= "Best regards,\nHair Skin Health Team";

        return $this->sendEmailNotification(new Request([
            'user_id' => $user->id,
            'subject' => $subject,
            'message' => $message,
            'type' => 'quiz_completion',
        ]));
    }

    /**
     * Get user notifications
     */
    public function getUserNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $notificationId)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($notificationId);

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Send bulk notifications
     */
    public function sendBulkNotifications(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422);
        }

        $successCount = 0;
        $failureCount = 0;

        foreach ($request->user_ids as $userId) {
            try {
                $this->sendEmailNotification(new Request([
                    'user_id' => $userId,
                    'subject' => $request->subject,
                    'message' => $request->message,
                ]));
                $successCount++;
            } catch (\Exception $e) {
                $failureCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Bulk notification sent. Success: {$successCount}, Failures: {$failureCount}",
            'data' => [
                'success_count' => $successCount,
                'failure_count' => $failureCount,
            ],
        ]);
    }
}
