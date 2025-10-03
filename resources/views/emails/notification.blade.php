<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $subject }}</title>
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
            background-color: #3B82F6;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #3B82F6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hair Skin Health</h1>
    </div>
    
    <div class="content">
        <h2>{{ $subject }}</h2>
        
        <p>Dear {{ $user->name }},</p>
        
        <div style="white-space: pre-line;">{{ $message }}</div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ config('app.frontend_patient_url') }}" class="button">Visit Portal</a>
        </div>
    </div>
    
    <div class="footer">
        <p>This email was sent from Hair Skin Health Platform.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html>
