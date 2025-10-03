<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dermatologist;
use App\Models\PatientProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@hairskinhealth.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1234567890',
            'is_active' => true,
        ]);

        // Create sample dermatologist
        $dermatologist = User::create([
            'name' => 'Dr. Sarah Johnson',
            'email' => 'dermatologist@hairskinhealth.com',
            'password' => Hash::make('password'),
            'role' => 'dermatologist',
            'phone' => '+1234567891',
            'date_of_birth' => '1980-05-15',
            'gender' => 'female',
            'is_active' => true,
        ]);

        $dermatologist->dermatologistProfile()->create([
            'license_number' => 'DERM123456',
            'specialization' => 'Hair Loss and Scalp Disorders',
            'years_of_experience' => 15,
            'qualifications' => 'MD Dermatology, Board Certified',
            'bio' => 'Dr. Sarah Johnson is a board-certified dermatologist with over 15 years of experience in treating hair loss and scalp disorders.',
            'consultation_fee' => 1500.00,
            'available_days' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            'start_time' => '09:00',
            'end_time' => '17:00',
            'timezone' => 'UTC',
            'is_available' => true,
            'max_patients_per_day' => 10,
        ]);

        // Create sample patient
        $patient = User::create([
            'name' => 'John Doe',
            'email' => 'patient@hairskinhealth.com',
            'password' => Hash::make('password'),
            'role' => 'patient',
            'phone' => '+1234567892',
            'date_of_birth' => '1990-03-20',
            'gender' => 'male',
            'is_active' => true,
        ]);

        $patient->patientProfile()->create([
            'medical_history' => 'No significant medical history',
            'allergies' => 'None known',
            'current_medications' => 'None',
            'lifestyle' => 'moderate',
            'smoking' => false,
            'alcohol_consumption' => false,
            'dietary_habits' => 'Balanced diet with occasional fast food',
            'stress_level' => 'Moderate work stress',
            'sleep_pattern' => '6-7 hours per night',
            'hair_care_routine' => 'Daily shampoo, occasional conditioner',
            'family_history' => 'Father experienced hair loss in his 40s',
        ]);
    }
}
