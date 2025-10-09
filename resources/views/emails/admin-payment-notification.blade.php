<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Payment Received</title>
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
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
        .notification-icon {
            font-size: 48px;
            color: #ff6b6b;
            margin-bottom: 20px;
        }
        .payment-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff6b6b;
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
        .user-info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
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
        .urgent {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="notification-icon">💰</div>
        <h1>New Payment Received!</h1>
        <p>Payment notification for admin</p>
    </div>
    
    <div class="content">
        <h2>Admin Notification</h2>
        
        <div class="urgent">
            <strong>⚠️ New Payment Alert:</strong> A new payment has been successfully processed and requires your attention.
        </div>
        
        <div class="payment-details">
            <h3>Payment Information</h3>
            
            <div class="detail-row">
                <span class="label">Amount Received:</span>
                <span class="value amount">₹{{ number_format($payment->amount, 2) }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Payment Type:</span>
                <span class="value">{{ ucfirst($paymentType) }}</span>
            </div>
            
            @if($itemName)
            <div class="detail-row">
                <span class="label">Item/Service:</span>
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
        
        <div class="user-info">
            <h3>Customer Information</h3>
            <div class="detail-row">
                <span class="label">Customer Name:</span>
                <span class="value">{{ $user->name }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ $user->email }}</span>
            </div>
            <div class="detail-row">
                <span class="label">User ID:</span>
                <span class="value">#{{ $user->id }}</span>
            </div>
        </div>
        
        @if($paymentType === 'subscription')
        <div class="urgent">
            <strong>📋 Action Required:</strong> A new subscription has been activated. Please verify the subscription details and ensure the customer has access to premium features.
        </div>
        @elseif($paymentType === 'consultation')
        <div class="urgent">
            <strong>📋 Action Required:</strong> A consultation payment has been received. Please ensure the appointment is properly scheduled and the dermatologist is notified.
        </div>
        @endif
        
        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Verify the payment in your admin dashboard</li>
            <li>Ensure the customer has received their confirmation email</li>
            <li>Check that all services are properly activated</li>
            <li>Monitor for any customer support requests</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ config('app.url') }}/admin/payments" class="cta-button">View in Admin Dashboard</a>
        </div>
        
        <p>This notification was automatically generated by the Hair & Skin Health Platform payment system.</p>
    </div>
    
    <div class="footer">
        <p>Admin Notification - Hair & Skin Health Platform</p>
        <p>© {{ date('Y') }} Hair & Skin Health Platform. All rights reserved.</p>
    </div>
</body>
</html>
