<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Reset - Hair & Skin Health</title>
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
            background: linear-gradient(135deg, #2C5282, #3182CE);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background: #2C5282;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button:hover {
            background: #1a365d;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #666;
        }
        .token {
            background: #e2e8f0;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hair & Skin Health</h1>
        <h2>Password Reset Request</h2>
    </div>
    
    <div class="content">
        <p>Hello {{ $user->name }},</p>
        
        <p>We received a request to reset your password for your Hair & Skin Health account.</p>
        
        <p>To reset your password, please click the button below:</p>
        
        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button">Reset Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <div class="token">{{ $resetUrl }}</div>
        
        <p><strong>Important:</strong></p>
        <ul>
            <li>This link will expire in 24 hours</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>For security reasons, this link can only be used once</li>
        </ul>
        
        <p>If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
        
        <p>Best regards,<br>
        The Hair & Skin Health Team</p>
    </div>
    
    <div class="footer">
        <p>This email was sent from Hair & Skin Health Platform.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html>
