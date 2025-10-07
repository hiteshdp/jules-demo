<?php
// Generated via prompt: prompts/laravel_auth_routes_fix_v1.md

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\DermatologistAuthController;
use App\Http\Controllers\Api\DermatologistAppointmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes (public)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Patient routes
    Route::prefix('patient')->group(function () {
        // Appointments
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        
        // Quiz
        Route::get('/quiz/questions', [QuizController::class, 'questions']);
        Route::post('/quiz/submit', [QuizController::class, 'submit']);
        Route::get('/quiz/responses', [QuizController::class, 'responses']);
    });

    // Dermatologist routes
    Route::prefix('dermatologist')->group(function () {
        // Authentication
        Route::get('/me', [DermatologistAuthController::class, 'me']);
        
        // Appointments
        Route::get('/appointments', [DermatologistAppointmentController::class, 'index']);
        Route::get('/appointments/{id}', [DermatologistAppointmentController::class, 'show']);
        Route::put('/appointments/{id}/status', [DermatologistAppointmentController::class, 'updateStatus']);
    });
});