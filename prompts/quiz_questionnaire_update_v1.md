# Quiz Questionnaire Update v1

## User Prompt:
Replace the current HairLossQuizQuestionSeeder with a new questionnaire structure that includes:

1. Basic Info (Age, Gender)
2. Hair Loss History (When noticed, Where, How fast, Family history)
3. Health & Lifestyle (Medical conditions, Medications, Diet, Sleep, Stress, Smoking/Alcohol)
4. Previous Treatments (What treatments tried)
5. Goals (Main objective)

## AI Response:
Updated the HairLossQuizQuestionSeeder.php file with a comprehensive 14-question questionnaire structured into 5 sections:

### Basic Info (2 questions)
- Q1: Age (text input)
- Q2: Gender (Male/Female/Other)

### Hair Loss History (4 questions)
- Q3: When first noticed hair loss (timeline options)
- Q4: Where hair loss is most noticeable (location options)
- Q5: How fast hair loss is progressing (speed options)
- Q6: Family history of hair loss (Yes/No/Not sure)

### Health & Lifestyle (6 questions)
- Q7: Known medical conditions (multiple choice)
- Q8: Current medications/supplements (Yes/No)
- Q9: Diet quality (Balanced/Poor/Irregular)
- Q10: Sleep quality (Good/Average/Poor)
- Q11: Stress level (Low/Moderate/High)
- Q12: Smoking/Alcohol consumption (Yes/No)

### Previous Treatments (1 question)
- Q13: Previous hair loss treatments tried (multiple choice)

### Goals (1 question)
- Q14: Main goal (regrow/slow loss/maintain/explore)

The seeder maintains proper Laravel structure with appropriate question types (text, single_choice, multiple_choice) and all questions are marked as required except where specified.

## Files Modified:
- `/database/seeders/HairLossQuizQuestionSeeder.php`

## Date: 2024-12-19
## Author: AI Assistant
