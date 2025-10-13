<?php
// Generated via prompt: prompts/laravel_skeleton_generation_v1.md

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Simple login route for Laravel's default authentication system
Route::get('/login', function () {
    return response()->json(['message' => 'Please use API authentication']);
})->name('login');

// Test route for Zoom video call feature
Route::get('/test-zoom', function () {
    try {
        $zoomService = app(\App\Services\ZoomService::class);

        // Create a test meeting
        $meeting = $zoomService->createMeeting(
            'Test Consultation - ' . now()->format('d/m/Y H:i:s'),
            now()->addMinutes(5)->toIso8601String(),
            30
        );

        return response()->json([
            'success' => true,
            'message' => 'Zoom test meeting created successfully!',
            'meeting_data' => [
                'id' => $meeting['id'],
                'topic' => $meeting['topic'],
                'join_url' => $meeting['join_url'],
                'start_url' => $meeting['start_url'],
                'password' => $meeting['password'] ?? 'No password required',
                'start_time' => $meeting['start_time'],
                'duration' => $meeting['duration']
            ],
            'instructions' => [
                '1. Click the join_url to join the meeting',
                '2. Use start_url if you are the host',
                '3. Meeting will start in 5 minutes',
                '4. Duration: 30 minutes'
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create test Zoom meeting',
            'error' => $e->getMessage(),
            'troubleshooting' => [
                '1. Check your .env file for ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, and ZOOM_ACCOUNT_ID',
                '2. Ensure your Zoom app has the necessary permissions',
                '3. Check the Laravel logs for detailed error information'
            ]
        ], 500);
    }
});
