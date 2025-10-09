<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .success-icon {
            font-size: 48px;
            color: #28a745;
            margin-bottom: 20px;
        }
        .payment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #333;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your payment</p>
    </div>
    
    <div class="content">
        <h2>Hello {{ $user->name }},</h2>
        
        <p>We're excited to confirm that your payment has been processed successfully! 🎉</p>
        
        <div class="payment-details">
            <h3>Payment Details</h3>
            
            <div class="detail-row">
                <span class="label">Amount Paid:</span>
                <span class="value amount">₹{{ number_format($payment->amount, 2) }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Payment Type:</span>
                <span class="value">{{ ucfirst($paymentType) }}</span>
            </div>
            
            @if($itemName)
            <div class="detail-row">
                <span class="label">Item:</span>
                <span class="value">{{ $itemName }}</span>
            </div>
            @endif
            
            <div class="detail-row">
                <span class="label">Transaction ID:</span>
                <span class="value">{{ $payment->razorpay_payment_id }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Payment Date:</span>
                <span class="value">{{ $payment->paid_at->format('F j, Y \a\t g:i A') }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value" style="color: #28a745; font-weight: bold;">{{ ucfirst($payment->status) }}</span>
            </div>
        </div>
        
        @if($paymentType === 'subscription')
        <p><strong>Your subscription is now active!</strong> You can access all premium features and services.</p>
        @elseif($paymentType === 'consultation')
        <p><strong>Your consultation has been confirmed!</strong> You can now access your appointment details and chat with your dermatologist.</p>
        @endif
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ config('app.url') }}/patient/dashboard" class="cta-button">Access Your Dashboard</a>
        </div>
        
        <p>Thank you for choosing Hair & Skin Health Platform for your healthcare needs!</p>
        
        <p>Best regards,<br>
        The Hair & Skin Health Team</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>© {{ date('Y') }} Hair & Skin Health Platform. All rights reserved.</p>
    </div>
</body>
</html>
