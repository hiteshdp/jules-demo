<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace Database\Seeders;

use App\Models\HairLossQuizQuestion;
use Illuminate\Database\Seeder;

class HairLossQuizQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'question' => 'How long have you been experiencing hair loss?',
                'type' => 'single_choice',
                'options' => ['Less than 3 months', '3-6 months', '6-12 months', '1-2 years', 'More than 2 years'],
                'order' => 1,
                'is_required' => true,
            ],
            [
                'question' => 'What type of hair loss are you experiencing?',
                'type' => 'multiple_choice',
                'options' => ['Thinning on top', 'Receding hairline', 'Bald patches', 'Overall thinning', 'Hair breakage'],
                'order' => 2,
                'is_required' => true,
            ],
            [
                'question' => 'How much hair do you lose daily?',
                'type' => 'single_choice',
                'options' => ['Less than 50 hairs', '50-100 hairs', '100-150 hairs', 'More than 150 hairs', 'Not sure'],
                'order' => 3,
                'is_required' => true,
            ],
            [
                'question' => 'Do you have a family history of hair loss?',
                'type' => 'single_choice',
                'options' => ['Yes, on mother\'s side', 'Yes, on father\'s side', 'Yes, on both sides', 'No family history', 'Not sure'],
                'order' => 4,
                'is_required' => true,
            ],
            [
                'question' => 'What is your current stress level?',
                'type' => 'scale',
                'options' => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                'order' => 5,
                'is_required' => true,
            ],
            [
                'question' => 'How many hours of sleep do you get per night?',
                'type' => 'single_choice',
                'options' => ['Less than 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', 'More than 8 hours'],
                'order' => 6,
                'is_required' => true,
            ],
            [
                'question' => 'What is your current diet?',
                'type' => 'single_choice',
                'options' => ['Very healthy', 'Moderately healthy', 'Average', 'Poor', 'Very poor'],
                'order' => 7,
                'is_required' => true,
            ],
            [
                'question' => 'Do you currently take any medications?',
                'type' => 'text',
                'options' => null,
                'order' => 8,
                'is_required' => false,
            ],
            [
                'question' => 'Have you recently experienced any major life changes?',
                'type' => 'single_choice',
                'options' => ['Yes, major stress', 'Yes, moderate stress', 'Yes, minor stress', 'No major changes', 'Not applicable'],
                'order' => 9,
                'is_required' => true,
            ],
            [
                'question' => 'What hair care products do you currently use?',
                'type' => 'multiple_choice',
                'options' => ['Regular shampoo', 'Anti-hair loss shampoo', 'Conditioner', 'Hair oil', 'Hair masks', 'Hair supplements', 'None'],
                'order' => 10,
                'is_required' => true,
            ],
        ];

        foreach ($questions as $question) {
            HairLossQuizQuestion::create($question);
        }
    }
}
