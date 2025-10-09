<?php
// Generated via prompt: prompts/quiz_questionnaire_update_v1.md

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
            // Basic Info
            [
                'question' => 'What is your age?',
                'type' => 'text',
                'options' => null,
                'order' => 1,
                'is_required' => true,
            ],
            [
                'question' => 'What is your gender?',
                'type' => 'single_choice',
                'options' => ['Male', 'Female', 'Other'],
                'order' => 2,
                'is_required' => true,
            ],
            // Hair Loss History
            [
                'question' => 'When did you first notice hair loss?',
                'type' => 'single_choice',
                'options' => ['Less than 6 months ago', '6 months – 1 year', '1–3 years', 'More than 3 years'],
                'order' => 3,
                'is_required' => true,
            ],
            [
                'question' => 'Where do you notice hair loss the most?',
                'type' => 'single_choice',
                'options' => ['Temples / hairline', 'Crown / top', 'Diffuse thinning all over', 'Patchy spots'],
                'order' => 4,
                'is_required' => true,
            ],
            [
                'question' => 'How fast is your hair loss progressing?',
                'type' => 'single_choice',
                'options' => ['Slow (gradual over years)', 'Moderate (noticeable in 1–2 years)', 'Rapid (big changes in a few months)'],
                'order' => 5,
                'is_required' => true,
            ],
            [
                'question' => 'Do you have a family history of hair loss?',
                'type' => 'single_choice',
                'options' => ['Yes', 'No', 'Not sure'],
                'order' => 6,
                'is_required' => true,
            ],
            // Health & Lifestyle
            [
                'question' => 'Do you have any known medical conditions?',
                'type' => 'multiple_choice',
                'options' => ['Thyroid', 'Hormonal imbalance', 'Autoimmune', 'High stress', 'None'],
                'order' => 7,
                'is_required' => true,
            ],
            [
                'question' => 'Are you currently taking any regular medications or supplements?',
                'type' => 'single_choice',
                'options' => ['Yes', 'No'],
                'order' => 8,
                'is_required' => true,
            ],
            [
                'question' => 'What is your current diet quality?',
                'type' => 'single_choice',
                'options' => ['Balanced', 'Poor', 'Irregular'],
                'order' => 9,
                'is_required' => true,
            ],
            [
                'question' => 'How would you rate your sleep quality?',
                'type' => 'single_choice',
                'options' => ['Good', 'Average', 'Poor'],
                'order' => 10,
                'is_required' => true,
            ],
            [
                'question' => 'What is your current stress level?',
                'type' => 'single_choice',
                'options' => ['Low', 'Moderate', 'High'],
                'order' => 11,
                'is_required' => true,
            ],
            [
                'question' => 'Do you smoke or consume alcohol regularly?',
                'type' => 'single_choice',
                'options' => ['Yes', 'No'],
                'order' => 12,
                'is_required' => true,
            ],
            // Previous Treatments
            [
                'question' => 'Have you tried any hair loss treatments before?',
                'type' => 'multiple_choice',
                'options' => ['Minoxidil', 'Finasteride / Dutasteride', 'PRP / Hair transplant', 'Natural remedies', 'None'],
                'order' => 13,
                'is_required' => true,
            ],
            // Goals
            [
                'question' => 'What\'s your main goal?',
                'type' => 'single_choice',
                'options' => ['Regrow lost hair', 'Slow/stop further hair loss', 'Maintain current hair', 'Explore all options'],
                'order' => 14,
                'is_required' => true,
            ],
        ];

        foreach ($questions as $question) {
            HairLossQuizQuestion::create($question);
        }
    }
}
