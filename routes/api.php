<?php
// Generated via prompt: prompts/laravel_auth_routes_fix_v1.md

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\AppointmentChatController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\DermatologistController;
use App\Http\Controllers\Api\DermatologistAuthController;
use App\Http\Controllers\Api\DermatologistAppointmentController;
use App\Http\Controllers\ZoomController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\AppointmentPaymentController;
use App\Http\Controllers\Api\WebhookController;
// use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AdminController;

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

// Admin routes
Route::prefix('admin')->group(function () {
    Route::get('dashboard', [AdminController::class, 'getDashboard']);
});

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

        // Appointment Chat
        Route::get('/appointments/{id}/chat', [AppointmentChatController::class, 'index']);
        Route::post('/appointments/{id}/chat', [AppointmentChatController::class, 'store']);

        // Quiz
        Route::get('/quiz/questions', [QuizController::class, 'questions']);
        Route::post('/quiz/submit', [QuizController::class, 'submit']);
        Route::get('/quiz/responses', [QuizController::class, 'responses']);

        // Dermatologists
        Route::get('/dermatologists', [PatientController::class, 'getDermatologists']);

        // Patient Profile Management
        Route::get('/profile', [PatientController::class, 'getProfile']);
        Route::put('/profile', [PatientController::class, 'updateProfile']);

        // Subscriptions
        Route::post('/subscription/create', [SubscriptionController::class, 'createSubscription']);
        Route::post('/subscription/verify', [SubscriptionController::class, 'verifyPayment']);
        Route::get('/subscription/status', [SubscriptionController::class, 'status']);
        Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel']);

        // Appointment Payments
        Route::post('/appointment/payment/create', [AppointmentPaymentController::class, 'createPayment']);
        Route::post('/appointment/payment/verify', [AppointmentPaymentController::class, 'verifyPayment']);
    });

    
    // Dermatologist routes
    Route::prefix('dermatologist')->group(function () {
        // Authentication
        Route::get('/me', [DermatologistAuthController::class, 'me']);

        // Appointments
        Route::get('/appointments', [DermatologistAppointmentController::class, 'index']);
        Route::get('/appointments/{id}', [DermatologistAppointmentController::class, 'show']);
        Route::put('/appointments/{id}/status', [DermatologistAppointmentController::class, 'updateStatus']);
        Route::put('/appointments/{id}/reschedule', [DermatologistAppointmentController::class, 'reschedule']);

        // Appointment Chat (Dermatologist)
        Route::get('/appointments/{id}/chat', [AppointmentChatController::class, 'index']);
        Route::post('/appointments/{id}/chat', [AppointmentChatController::class, 'store']);

        // Dermatologist Profile Management
        Route::get('/profile', [DermatologistController::class, 'getProfile']);
        Route::put('/profile', [DermatologistController::class, 'updateProfile']);
    });

    // Zoom video call routes (available to both patients and dermatologists)
    Route::post('/zoom/create-meeting', [ZoomController::class, 'create']);

    // New Zoom meeting management routes
    Route::post('/zoom-meetings', [App\Http\Controllers\Api\ZoomMeetingController::class, 'create']);
    Route::post('/zoom-meetings/{id}/start', [App\Http\Controllers\Api\ZoomMeetingController::class, 'start']);
    Route::post('/zoom-meetings/{id}/end', [App\Http\Controllers\Api\ZoomMeetingController::class, 'end']);
    Route::get('/zoom-meetings/status/{appointmentId}', [App\Http\Controllers\Api\ZoomMeetingController::class, 'getStatus']);

    // Admin routes (protected by auth:sanctum above)
    Route::prefix('admin')->group(function () {
        // Patient management CRUD
        Route::apiResource('patients', PatientController::class);

        // Dermatologist management CRUD
        Route::apiResource('dermatologists', DermatologistController::class);

        // Product management CRUD
        Route::get('/products', [AdminController::class, 'getProducts']);
        Route::post('/products', [AdminController::class, 'createProduct']);
        Route::get('/products/{id}', [AdminController::class, 'getProduct']);
        Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);

        // Admin settings
        Route::get('/settings', [AdminController::class, 'getSettings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);

        // Appointments management
        Route::get('/appointments', [AdminController::class, 'getAppointments']);
        Route::get('/appointments/{id}', [AdminController::class, 'getAppointmentDetails']);
        Route::get('/appointments/{id}/chat', [AdminController::class, 'getAppointmentChat']);
        Route::get('/appointments/filters/dermatologists', [AdminController::class, 'getDermatologistsForFilter']);
        Route::get('/appointments/filters/patients', [AdminController::class, 'getPatientsForFilter']);
        Route::put('/appointments/{id}/payment-status', [AdminController::class, 'updateAppointmentPaymentStatus']);
    });
});

// Razorpay webhook (public)
Route::post('/razorpay/webhook', [WebhookController::class, 'handle']);

// Test route for appointments (temporary - remove in production)
Route::get('/test/appointments', function () {
    $appointments = \App\Models\Appointment::with([
        'patient',
        'dermatologist.user',
        'chatMessages',
        'payments'
    ])->orderBy('scheduled_at', 'desc')->paginate(20);

    return response()->json([
        'success' => true,
        'data' => $appointments
    ]);
});
