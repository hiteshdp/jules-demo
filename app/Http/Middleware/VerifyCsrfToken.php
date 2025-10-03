<?php
// Generated via prompt: prompts/laravel_csrf_api_fix_v1.md

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
        'api/login',
        'api/register',
        'api/logout',
        'api/me',
        'api/user',
    ];
}
