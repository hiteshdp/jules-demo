<?php
// Generated via prompt: prompts/payment_email_notifications_v1.md

namespace App\Mail;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminPaymentNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Payment $payment;
    public User $user;
    public string $paymentType;
    public string $itemName;

    /**
     * Create a new message instance.
     */
    public function __construct(Payment $payment, User $user, string $paymentType = '', string $itemName = '')
    {
        $this->payment = $payment;
        $this->user = $user;
        $this->paymentType = $paymentType;
        $this->itemName = $itemName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Payment Received - Hair & Skin Health Platform',
            tags: ['admin-notification', 'payment-received'],
            metadata: [
                'payment_id' => $this->payment->id,
                'user_id' => $this->user->id,
                'amount' => $this->payment->amount,
                'type' => $this->paymentType,
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-payment-notification',
            with: [
                'user' => $this->user,
                'payment' => $this->payment,
                'paymentType' => $this->paymentType,
                'itemName' => $this->itemName,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}