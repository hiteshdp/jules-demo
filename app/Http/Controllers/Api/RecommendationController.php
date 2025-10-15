<?php

// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HairLossQuizResponse;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecommendationController extends Controller
{
    /**
     * Get personalized recommendations based on quiz responses
     */
    public function getRecommendations(Request $request)
    {
        $user = $request->user();

        // Get user's quiz responses
        $responses = HairLossQuizResponse::with('question')
            ->where('user_id', $user->id)
            ->get();

        if ($responses->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Please complete the hair loss quiz to get personalized recommendations',
            ]);
        }

        // Analyze responses and generate recommendations
        $recommendations = $this->analyzeResponses($responses);

        return response()->json([
            'success' => true,
            'data' => $recommendations,
        ]);
    }

    /**
     * Analyze quiz responses and generate recommendations
     */
    private function analyzeResponses($responses)
    {
        $recommendations = [];
        $hairLossSeverity = $this->assessHairLossSeverity($responses);
        $lifestyleFactors = $this->assessLifestyleFactors($responses);

        // Product recommendations based on severity
        if ($hairLossSeverity >= 7) {
            $recommendations[] = [
                'type' => 'product',
                'title' => 'Hair Growth Serum',
                'description' => 'Based on your responses, we recommend a concentrated hair growth serum with minoxidil.',
                'priority' => 'high',
                'category' => 'treatment',
                'reason' => 'High hair loss severity detected',
            ];
        }

        if ($hairLossSeverity >= 5) {
            $recommendations[] = [
                'type' => 'product',
                'title' => 'Gentle Hair Loss Shampoo',
                'description' => 'A sulfate-free shampoo specifically formulated for hair loss prevention.',
                'priority' => 'high',
                'category' => 'shampoo',
                'reason' => 'Moderate to high hair loss severity',
            ];
        }

        // Lifestyle recommendations
        if ($lifestyleFactors['stress_level'] >= 7) {
            $recommendations[] = [
                'type' => 'lifestyle',
                'title' => 'Stress Management',
                'description' => 'High stress levels can contribute to hair loss. Consider stress reduction techniques.',
                'priority' => 'high',
                'reason' => 'High stress level detected',
            ];
        }

        if ($lifestyleFactors['sleep_hours'] < 6) {
            $recommendations[] = [
                'type' => 'lifestyle',
                'title' => 'Improve Sleep Pattern',
                'description' => 'Getting 7-8 hours of quality sleep can help reduce hair loss.',
                'priority' => 'medium',
                'reason' => 'Insufficient sleep detected',
            ];
        }

        if ($lifestyleFactors['diet_quality'] <= 3) {
            $recommendations[] = [
                'type' => 'lifestyle',
                'title' => 'Improve Diet',
                'description' => 'A balanced diet rich in vitamins and minerals supports healthy hair growth.',
                'priority' => 'medium',
                'reason' => 'Poor diet quality detected',
            ];
        }

        // Family history recommendation
        $familyHistory = $this->checkFamilyHistory($responses);
        if ($familyHistory) {
            $recommendations[] = [
                'type' => 'consultation',
                'title' => 'Genetic Hair Loss Consultation',
                'description' => 'Family history of hair loss detected. Consider early intervention with a dermatologist.',
                'priority' => 'high',
                'reason' => 'Family history of hair loss',
            ];
        }

        // General recommendations
        $recommendations[] = [
            'type' => 'product',
            'title' => 'Biotin Supplements',
            'description' => 'Biotin supplements can support healthy hair growth from within.',
            'priority' => 'medium',
            'category' => 'supplement',
            'reason' => 'General hair health support',
        ];

        $recommendations[] = [
            'type' => 'consultation',
            'title' => 'Professional Consultation',
            'description' => 'Book a consultation with our dermatologist for personalized treatment plan.',
            'priority' => 'high',
            'reason' => 'Professional assessment recommended',
        ];

        return $recommendations;
    }

    /**
     * Assess hair loss severity from responses
     */
    private function assessHairLossSeverity($responses)
    {
        $severity = 0;

        foreach ($responses as $response) {
            $question = $response->question;

            if (strpos($question->question, 'hair loss') !== false) {
                if (strpos($response->answer, 'More than 2 years') !== false) {
                    $severity += 3;
                } elseif (strpos($response->answer, '1-2 years') !== false) {
                    $severity += 2;
                } elseif (strpos($response->answer, '6-12 months') !== false) {
                    $severity += 1;
                }
            }

            if (strpos($question->question, 'lose daily') !== false) {
                if (strpos($response->answer, 'More than 150') !== false) {
                    $severity += 3;
                } elseif (strpos($response->answer, '100-150') !== false) {
                    $severity += 2;
                } elseif (strpos($response->answer, '50-100') !== false) {
                    $severity += 1;
                }
            }
        }

        return min($severity, 10);
    }

    /**
     * Assess lifestyle factors from responses
     */
    private function assessLifestyleFactors($responses)
    {
        $factors = [
            'stress_level' => 5,
            'sleep_hours' => 7,
            'diet_quality' => 3,
        ];

        foreach ($responses as $response) {
            $question = $response->question;

            if (strpos($question->question, 'stress level') !== false) {
                $factors['stress_level'] = (int) $response->answer;
            }

            if (strpos($question->question, 'sleep') !== false) {
                if (strpos($response->answer, 'Less than 5') !== false) {
                    $factors['sleep_hours'] = 4;
                } elseif (strpos($response->answer, '5-6') !== false) {
                    $factors['sleep_hours'] = 5;
                } elseif (strpos($response->answer, '6-7') !== false) {
                    $factors['sleep_hours'] = 6;
                } elseif (strpos($response->answer, '7-8') !== false) {
                    $factors['sleep_hours'] = 7;
                } elseif (strpos($response->answer, 'More than 8') !== false) {
                    $factors['sleep_hours'] = 9;
                }
            }

            if (strpos($question->question, 'diet') !== false) {
                if (strpos($response->answer, 'Very healthy') !== false) {
                    $factors['diet_quality'] = 5;
                } elseif (strpos($response->answer, 'Moderately healthy') !== false) {
                    $factors['diet_quality'] = 4;
                } elseif (strpos($response->answer, 'Average') !== false) {
                    $factors['diet_quality'] = 3;
                } elseif (strpos($response->answer, 'Poor') !== false) {
                    $factors['diet_quality'] = 2;
                } elseif (strpos($response->answer, 'Very poor') !== false) {
                    $factors['diet_quality'] = 1;
                }
            }
        }

        return $factors;
    }

    /**
     * Check for family history of hair loss
     */
    private function checkFamilyHistory($responses)
    {
        foreach ($responses as $response) {
            $question = $response->question;

            if (strpos($question->question, 'family history') !== false) {
                return strpos($response->answer, 'Yes') !== false;
            }
        }

        return false;
    }

    /**
     * Get AI-powered recommendations using OpenAI
     */
    public function getAIRecommendations(Request $request)
    {
        $user = $request->user();

        // Get user's quiz responses
        $responses = HairLossQuizResponse::with('question')
            ->where('user_id', $user->id)
            ->get();

        if ($responses->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Please complete the hair loss quiz first',
            ], 400);
        }

        // Prepare context for AI
        $context = $this->prepareContextForAI($responses);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.config('services.openai.api_key'),
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a hair loss specialist. Analyze the patient\'s responses and provide personalized recommendations for hair loss treatment and prevention. Focus on practical, actionable advice.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $context,
                    ],
                ],
                'max_tokens' => 1000,
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json();
                $recommendations = $aiResponse['choices'][0]['message']['content'];

                return response()->json([
                    'success' => true,
                    'data' => [
                        'type' => 'ai_recommendations',
                        'content' => $recommendations,
                        'generated_at' => now(),
                    ],
                ]);
            }

        } catch (\Exception $e) {
            // Fallback to rule-based recommendations
            return $this->getRecommendations($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to generate AI recommendations',
        ], 500);
    }

    /**
     * Prepare context for AI analysis
     */
    private function prepareContextForAI($responses)
    {
        $context = "Patient Hair Loss Assessment:\n\n";

        foreach ($responses as $response) {
            $context .= 'Q: '.$response->question->question."\n";
            $context .= 'A: '.$response->answer."\n\n";
        }

        $context .= 'Please provide personalized recommendations for hair loss treatment and prevention based on these responses.';

        return $context;
    }
}
