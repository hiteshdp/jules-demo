<?php
// Generated via prompt: prompts/payment_email_notifications_v1.md

namespace App\Services;

use App\Mail\PaymentSuccessMail;
use App\Mail\AdminPaymentNotificationMail;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class PaymentNotificationService
{
    /**
     * Send payment success notifications
     */
    public function sendPaymentSuccessNotifications(Payment $payment): void
    {
        try {
            $user = $payment->user;
            $paymentType = $this->getPaymentType($payment);
            $itemName = $this->getItemName($payment);

            // Send email to customer
            $this->sendCustomerNotification($payment, $user, $paymentType, $itemName);

            // Send email to admin
            $this->sendAdminNotification($payment, $user, $paymentType, $itemName);

            Log::info('Payment success notifications sent', [
                'payment_id' => $payment->id,
                'user_id' => $user->id,
                'amount' => $payment->amount,
                'type' => $paymentType
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send payment notifications', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Send notification to customer
     */
    private function sendCustomerNotification(Payment $payment, User $user, string $paymentType, string $itemName): void
    {
        try {
            Mail::to($user->email)->send(
                new PaymentSuccessMail($payment, $user, $paymentType, $itemName)
            );

            Log::info('Customer payment notification sent', [
                'payment_id' => $payment->id,
                'user_email' => $user->email
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send customer payment notification', [
                'payment_id' => $payment->id,
                'user_email' => $user->email,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send notification to admin
     */
    private function sendAdminNotification(Payment $payment, User $user, string $paymentType, string $itemName): void
    {
        try {
            // Get admin email from config or use a default
            $adminEmail = config('services.mail.admin_email', 'admin@hairskinhealth.com');
            
            Mail::to($adminEmail)->send(
                new AdminPaymentNotificationMail($payment, $user, $paymentType, $itemName)
            );

            Log::info('Admin payment notification sent', [
                'payment_id' => $payment->id,
                'admin_email' => $adminEmail
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send admin payment notification', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Determine payment type based on payment data
     */
    private function getPaymentType(Payment $payment): string
    {
        return $payment->type ?? 'payment';
    }

    /**
     * Get item name based on payment type and payable model
     */
    private function getItemName(Payment $payment): string
    {
        $payable = $payment->payable;
        
        if (!$payable) {
            return 'Service Payment';
        }

        switch ($payment->type) {
            case 'subscription':
                return $payable->plan_name ?? 'Monthly Subscription';
            
            case 'consultation':
                return 'Dermatologist Consultation';
            
            default:
                return 'Service Payment';
        }
    }

    /**
     * Send bulk payment notifications (for webhook processing)
     */
    public function sendBulkPaymentNotifications(array $payments): void
    {
        foreach ($payments as $payment) {
            if ($payment instanceof Payment) {
                $this->sendPaymentSuccessNotifications($payment);
            }
        }
    }
}
