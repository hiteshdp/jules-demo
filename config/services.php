<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'razorpay' => [
        'key_id' => env('RAZORPAY_KEY_ID'),
        'key_secret' => env('RAZORPAY_KEY_SECRET'),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
    ],

    'zoom' => [
        'api_key' => env('ZOOM_API_KEY'),
        'api_secret' => env('ZOOM_API_SECRET'),
        'redirect_uri' => env('ZOOM_REDIRECT_URI'),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'chat_model' => env('OPENAI_CHAT_MODEL', 'gpt-4o-mini'),
    ],

    /*
     * Groq (OpenAI-compatible API) – used by AI Orchestrator when OPENAI_BASE_URL points to Groq.
     */
    'groq' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.groq.com/openai/v1'),
        'model' => env('OPENAI_MODEL', 'llama-3.1-70b-versatile'),
        'max_tokens' => env('OPENAI_MAX_TOKENS', 8192),
    ],

    'github' => [
        'token' => env('GITHUB_TOKEN'),
        'owner' => env('GITHUB_REPO_OWNER'),
        'repo' => env('GITHUB_REPO_NAME'),
    ],

    'claude' => [
        'api_key' => env('CLAUDE_API_KEY'),
        'api_url' => env('CLAUDE_API_URL', 'https://api.anthropic.com/v1/messages'),
        'model' => env('CLAUDE_MODEL', 'claude-3-7-sonnet'),
        'max_tokens' => env('CLAUDE_MAX_TOKENS', 8192),
    ],

    'mail' => [
        'admin_email' => env('MAIL_ADMIN_EMAIL', 'admin@hairskinhealth.com'),
    ],

];
