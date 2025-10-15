<?php

// Generated via prompt: prompts/laravel_skeleton_generation_v1.md

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // API middleware group - no CSRF, no stateful requests
        $middleware->api([
            // No CSRF middleware for API routes
            // No EnsureFrontendRequestsAreStateful for pure API usage
        ]);

        // Web middleware group - includes CSRF protection
        $middleware->web(append: [
            \App\Http\Middleware\VerifyCsrfToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle authentication exceptions for API routes
        $exceptions->render(function (Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }
        });
    })->create();
