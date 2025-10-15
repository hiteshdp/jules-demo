<?php

// Generated via prompt: prompts/laravel_missing_api_routes_fix_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HairLossQuizQuestion;
use App\Models\HairLossQuizResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Schema(
 *     schema="QuizQuestion",
 *     type="object",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="question", type="string", example="Do you experience hair loss?"),
 *     @OA\Property(property="type", type="string", enum={"multiple_choice","text","yes_no"}, example="yes_no"),
 *     @OA\Property(property="order", type="integer", example=1),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="QuizResponse",
 *     type="object",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="question_id", type="integer", example=1),
 *     @OA\Property(property="answer", type="string", example="Yes"),
 *     @OA\Property(property="selected_option_id", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-01T00:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-01T00:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="QuizSubmitRequest",
 *     type="object",
 *     required={"responses"},
 *
 *     @OA\Property(
 *         property="responses",
 *         type="array",
 *
 *         @OA\Items(
 *
 *             @OA\Property(property="question_id", type="integer", example=1),
 *             @OA\Property(property="answer", type="string", example="Yes"),
 *             @OA\Property(property="selected_option_id", type="integer", example=1)
 *         )
 *     )
 * )
 *
 * @OA\Tag(
 *     name="Quiz",
 *     description="Hair loss quiz endpoints"
 * )
 */
class QuizController extends Controller
{
    /**
     * @OA\Get(
     *     path="/patient/quiz/questions",
     *     summary="Get quiz questions",
     *     description="Get all hair loss quiz questions",
     *     tags={"Quiz"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Quiz questions retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="questions", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     )
     * )
     */
    public function questions(Request $request): JsonResponse
    {
        $questions = HairLossQuizQuestion::orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'questions' => $questions,
            ],
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/patient/quiz/submit",
     *     summary="Submit quiz responses",
     *     description="Submit hair loss quiz responses for analysis",
     *     tags={"Quiz"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *
     *         @OA\JsonContent(
     *             required={"responses"},
     *
     *             @OA\Property(
     *                 property="responses",
     *                 type="array",
     *
     *                 @OA\Items(
     *
     *                     @OA\Property(property="question_id", type="integer", example=1),
     *                     @OA\Property(property="answer", type="string", example="Yes"),
     *                     @OA\Property(property="selected_option_id", type="integer", example=1)
     *                 )
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Quiz responses submitted successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Quiz responses submitted successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validation errors",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation errors"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function submit(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'responses' => 'required|array|min:1',
            'responses.*.question_id' => 'required|exists:hair_loss_quiz_questions,id',
            'responses.*.answer' => 'required|string|max:500',
            'responses.*.selected_option_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Save each response (update if exists, create if not)
        foreach ($request->responses as $response) {
            HairLossQuizResponse::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'question_id' => $response['question_id'],
                ],
                [
                    'answer' => $response['answer'],
                    'selected_option_id' => $response['selected_option_id'] ?? null,
                ]
            );
        }

        // Calculate quiz score and recommendations (simplified)
        $totalQuestions = count($request->responses);
        $riskFactors = $this->calculateRiskFactors($request->responses);
        $recommendations = $this->generateRecommendations($riskFactors);

        return response()->json([
            'success' => true,
            'message' => 'Quiz responses submitted successfully',
            'data' => [
                'total_questions' => $totalQuestions,
                'risk_factors' => $riskFactors,
                'recommendations' => $recommendations,
                'next_steps' => $this->getNextSteps($riskFactors),
            ],
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/patient/quiz/responses",
     *     summary="Get user's quiz responses",
     *     description="Get all quiz responses for the authenticated user",
     *     tags={"Quiz"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="Quiz responses retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="responses", type="array", @OA\Items(type="object"))
     *             )
     *         )
     *     )
     * )
     */
    public function responses(Request $request): JsonResponse
    {
        $user = $request->user();

        $responses = HairLossQuizResponse::where('user_id', $user->id)
            ->with(['question'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'responses' => $responses,
            ],
        ], 200);
    }

    /**
     * Calculate risk factors based on quiz responses
     */
    private function calculateRiskFactors(array $responses): array
    {
        $riskFactors = [];

        foreach ($responses as $response) {
            $question = HairLossQuizQuestion::find($response['question_id']);
            if ($question) {
                // Simple risk factor calculation based on question type
                if (
                    str_contains(strtolower($response['answer']), 'yes') ||
                    str_contains(strtolower($response['answer']), 'often') ||
                    str_contains(strtolower($response['answer']), 'daily')
                ) {
                    $riskFactors[] = $question->question;
                }
            }
        }

        return $riskFactors;
    }

    /**
     * Generate recommendations based on risk factors
     */
    private function generateRecommendations(array $riskFactors): array
    {
        $recommendations = [];

        if (count($riskFactors) > 5) {
            $recommendations[] = 'High risk detected. We recommend consulting with a dermatologist immediately.';
        } elseif (count($riskFactors) > 2) {
            $recommendations[] = 'Moderate risk detected. Consider lifestyle changes and monitor your hair health.';
        } else {
            $recommendations[] = 'Low risk detected. Continue maintaining good hair care practices.';
        }

        return $recommendations;
    }

    /**
     * Get next steps based on risk factors
     */
    private function getNextSteps(array $riskFactors): array
    {
        $nextSteps = [];

        if (count($riskFactors) > 3) {
            $nextSteps[] = 'Schedule a consultation with a dermatologist';
            $nextSteps[] = 'Consider our premium treatment plans';
        } else {
            $nextSteps[] = 'Explore our hair care products';
            $nextSteps[] = 'Join our community for tips and support';
        }

        return $nextSteps;
    }
}
