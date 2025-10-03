<?php
// Generated via prompt: prompts/laravel_swagger_documentation_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HairLossQuizQuestion;
use App\Models\HairLossQuizResponse;
use App\Models\PatientProfile;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\Appointment;
use App\Models\Dermatologist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Patients",
 *     description="Patient-specific endpoints"
 * )
 */
class PatientController extends Controller
{
    /**
     * Get patient profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $user->load('patientProfile');

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update patient profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'lifestyle' => 'nullable|in:sedentary,moderate,active,very_active',
            'smoking' => 'nullable|boolean',
            'alcohol_consumption' => 'nullable|boolean',
            'dietary_habits' => 'nullable|string',
            'stress_level' => 'nullable|string',
            'sleep_pattern' => 'nullable|string',
            'hair_care_routine' => 'nullable|string',
            'family_history' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        
        // Update user data
        $user->update($request->only(['name', 'phone', 'date_of_birth', 'gender']));
        
        // Update patient profile
        $profileData = $request->only([
            'medical_history', 'allergies', 'current_medications', 'lifestyle',
            'smoking', 'alcohol_consumption', 'dietary_habits', 'stress_level',
            'sleep_pattern', 'hair_care_routine', 'family_history'
        ]);
        
        $user->patientProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        $user->load('patientProfile');

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Get hair loss quiz questions
     */
    public function getQuizQuestions()
    {
        $questions = HairLossQuizQuestion::orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

    /**
     * Submit hair loss quiz responses
     */
    public function submitQuiz(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'responses' => 'required|array',
            'responses.*.question_id' => 'required|exists:hair_loss_quiz_questions,id',
            'responses.*.answer' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Delete existing responses
        $user->quizResponses()->delete();

        // Create new responses
        foreach ($request->responses as $response) {
            HairLossQuizResponse::create([
                'user_id' => $user->id,
                'question_id' => $response['question_id'],
                'answer' => $response['answer'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quiz submitted successfully'
        ]);
    }

    /**
     * Get personalized recommendations (stub for ChatGPT integration)
     */
    public function getRecommendations(Request $request)
    {
        $user = $request->user();
        $user->load(['quizResponses.question', 'patientProfile']);

        // This is a stub - in real implementation, you would call ChatGPT API
        $recommendations = [
            [
                'type' => 'product',
                'title' => 'Gentle Shampoo for Hair Loss',
                'description' => 'Based on your quiz responses, we recommend a gentle, sulfate-free shampoo.',
                'product_id' => 1,
                'priority' => 'high'
            ],
            [
                'type' => 'lifestyle',
                'title' => 'Improve Sleep Pattern',
                'description' => 'Getting 7-8 hours of quality sleep can help reduce hair loss.',
                'priority' => 'medium'
            ],
            [
                'type' => 'consultation',
                'title' => 'Book Consultation',
                'description' => 'Consider booking a consultation with our dermatologist for personalized treatment.',
                'priority' => 'high'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $recommendations
        ]);
    }

    /**
     * Get available dermatologists
     */
    public function getDermatologists()
    {
        $dermatologists = Dermatologist::with('user')
            ->where('is_available', true)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $dermatologists
        ]);
    }

    /**
     * Book appointment
     */
    public function bookAppointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dermatologist_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $dermatologist = Dermatologist::where('user_id', $request->dermatologist_id)->first();
        
        if (!$dermatologist) {
            return response()->json([
                'success' => false,
                'message' => 'Dermatologist not found'
            ], 404);
        }

        $appointment = Appointment::create([
            'patient_id' => $request->user()->id,
            'dermatologist_id' => $request->dermatologist_id,
            'scheduled_at' => $request->scheduled_at,
            'consultation_fee' => $dermatologist->consultation_fee,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment booked successfully',
            'data' => $appointment
        ]);
    }

    /**
     * Get patient appointments
     */
    public function getAppointments(Request $request)
    {
        $appointments = Appointment::with(['dermatologist.user'])
            ->where('patient_id', $request->user()->id)
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    /**
     * Get patient subscriptions
     */
    public function getSubscriptions(Request $request)
    {
        $subscriptions = Subscription::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    /**
     * Get products catalog
     */
    public function getProducts(Request $request)
    {
        $products = Product::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}
