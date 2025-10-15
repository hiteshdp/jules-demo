<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\AdminSubscriptionController;
use App\Http\Controllers\Api\AppointmentChatController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AppointmentPaymentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DermatologistAppointmentController;
use App\Http\Controllers\Api\DermatologistAuthController;
use App\Http\Controllers\Api\DermatologistController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\ZoomMeetingController;
use Illuminate\Support\Facades\Route;

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

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Webhook for Razorpay
    Route::post('/razorpay/webhook', [WebhookController::class, 'handle']);
});

// Protected routes
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Common authenticated routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminController::class, 'getDashboard']);

        // Resource management
        Route::apiResource('patients', PatientController::class);
        Route::apiResource('dermatologists', DermatologistController::class);
        Route::apiResource('products', AdminController::class)->except(['show']); // Assuming AdminController handles products

        // Settings
        Route::get('/settings', [AdminController::class, 'getSettings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);

        // Appointments
        Route::prefix('appointments')->name('appointments.')->group(function () {
            Route::get('/', [AdminController::class, 'getAppointments'])->name('index');
            Route::get('/{id}', [AdminController::class, 'getAppointmentDetails'])->name('show');
            Route::get('/{id}/chat', [AdminController::class, 'getAppointmentChat'])->name('chat');
            Route::put('/{id}/payment-status', [AdminController::class, 'updateAppointmentPaymentStatus'])->name('updatePaymentStatus');
            Route::get('/filters/dermatologists', [AdminController::class, 'getDermatologistsForFilter'])->name('filters.dermatologists');
            Route::get('/filters/patients', [AdminController::class, 'getPatientsForFilter'])->name('filters.patients');
        });

        // Subscriptions
        Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
            Route::get('/', [AdminSubscriptionController::class, 'index'])->name('index');
            Route::get('/statistics', [AdminSubscriptionController::class, 'statistics'])->name('statistics');
            Route::get('/{id}', [AdminSubscriptionController::class, 'show'])->name('show');
        });
    });

    // Patient routes
    Route::prefix('patient')->name('patient.')->group(function () {
        Route::apiResource('appointments', AppointmentController::class)->except(['update', 'destroy']);
        Route::prefix('appointments/{id}/chat')->name('appointments.chat.')->group(function () {
            Route::get('/', [AppointmentChatController::class, 'index'])->name('index');
            Route::post('/', [AppointmentChatController::class, 'store'])->name('store');
            Route::get('/{messageId}/download', [AppointmentChatController::class, 'downloadAttachment'])->name('download');
        });

        // Quiz
        Route::prefix('quiz')->name('quiz.')->group(function () {
            Route::get('/questions', [QuizController::class, 'questions'])->name('questions');
            Route::post('/submit', [QuizController::class, 'submit'])->name('submit');
            Route::get('/responses', [QuizController::class, 'responses'])->name('responses');
        });

        // Dermatologists
        Route::get('/dermatologists', [PatientController::class, 'getDermatologists'])->name('dermatologists');

        // Profile
        Route::get('/profile', [PatientController::class, 'getProfile'])->name('profile.show');
        Route::put('/profile', [PatientController::class, 'updateProfile'])->name('profile.update');

        // Subscriptions
        Route::prefix('subscription')->name('subscription.')->group(function () {
            Route::post('/create', [SubscriptionController::class, 'createSubscription'])->name('create');
            Route::post('/verify', [SubscriptionController::class, 'verifyPayment'])->name('verify');
            Route::get('/status', [SubscriptionController::class, 'status'])->name('status');
            Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
        });

        // Payments
        Route::prefix('appointment/payment')->name('payment.')->group(function () {
            Route::post('/create', [AppointmentPaymentController::class, 'createPayment'])->name('create');
            Route::post('/verify', [AppointmentPaymentController::class, 'verifyPayment'])->name('verify');
        });
    });

    // Dermatologist routes
    Route::prefix('dermatologist')->name('dermatologist.')->group(function () {
        Route::get('/me', [DermatologistAuthController::class, 'me'])->name('me');
        Route::apiResource('appointments', DermatologistAppointmentController::class)->only(['index', 'show']);
        Route::put('/appointments/{id}/status', [DermatologistAppointmentController::class, 'updateStatus'])->name('appointments.updateStatus');
        Route::put('/appointments/{id}/reschedule', [DermatologistAppointmentController::class, 'reschedule'])->name('appointments.reschedule');

        // Chat
        Route::prefix('appointments/{id}/chat')->name('appointments.chat.')->group(function () {
            Route::get('/', [AppointmentChatController::class, 'index'])->name('index');
            Route::post('/', [AppointmentChatController::class, 'store'])->name('store');
            Route::get('/{messageId}/download', [AppointmentChatController::class, 'downloadAttachment'])->name('download');
        });

        // Profile
        Route::get('/profile', [DermatologistController::class, 'getProfile'])->name('profile.show');
        Route::put('/profile', [DermatologistController::class, 'updateProfile'])->name('profile.update');
    });

    // Shared routes
    Route::prefix('zoom-meetings')->name('zoom.')->group(function () {
        Route::post('/', [ZoomMeetingController::class, 'create'])->name('create');
        Route::post('/{id}/start', [ZoomMeetingController::class, 'start'])->name('start');
        Route::post('/{id}/end', [ZoomMeetingController::class, 'end'])->name('end');
        Route::get('/status/{appointmentId}', [ZoomMeetingController::class, 'getStatus'])->name('status');
    });
});
