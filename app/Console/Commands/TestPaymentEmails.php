<?php

// Generated via prompt: prompts/payment_email_notifications_v1.md

namespace App\Console\Commands;

use App\Mail\AdminPaymentNotificationMail;
use App\Mail\PaymentSuccessMail;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Services\PaymentNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestPaymentEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:payment-emails {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test payment email notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $testEmail = $this->argument('email') ?? 'test@example.com';

        $this->info('Testing Payment Email Notifications...');

        // Create a test user
        $user = User::first();
        if (! $user) {
            $this->error('No users found in database. Please create a user first.');

            return 1;
        }

        // Create a test payment
        $payment = Payment::create([
            'user_id' => $user->id,
            'payable_type' => Subscription::class,
            'payable_id' => 1,
            'type' => 'subscription',
            'amount' => 500.00,
            'currency' => 'INR',
            'razorpay_payment_id' => 'pay_test_'.time(),
            'razorpay_order_id' => 'order_test_'.time(),
            'status' => 'completed',
            'razorpay_response' => ['test' => true],
            'paid_at' => now(),
        ]);

        $this->info("Created test payment with ID: {$payment->id}");

        // Test the notification service
        $notificationService = app(PaymentNotificationService::class);

        try {
            $this->info('Sending payment success notifications...');
            $notificationService->sendPaymentSuccessNotifications($payment);
            $this->info('✅ Payment notifications sent successfully!');

            // Test individual mailables
            $this->info('Testing individual mailables...');

            // Test customer email
            Mail::to($testEmail)->send(
                new PaymentSuccessMail($payment, $user, 'subscription', 'Monthly Subscription')
            );
            $this->info('✅ Customer email sent to: '.$testEmail);

            // Test admin email
            Mail::to($testEmail)->send(
                new AdminPaymentNotificationMail($payment, $user, 'subscription', 'Monthly Subscription')
            );
            $this->info('✅ Admin email sent to: '.$testEmail);

            $this->info('🎉 All email tests completed successfully!');

        } catch (\Exception $e) {
            $this->error('❌ Email test failed: '.$e->getMessage());

            return 1;
        }

        // Clean up test payment
        $payment->delete();
        $this->info('Test payment cleaned up.');

        return 0;
    }
}
