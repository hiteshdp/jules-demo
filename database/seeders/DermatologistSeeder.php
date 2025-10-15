<?php

// Generated via prompt: prompts/dermatologist_seeder_v1.md

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DermatologistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update test dermatologist user
        $dermatologist = User::updateOrCreate(
            ['email' => 'dermatologist@hairskinhealth.com'],
            [
                'name' => 'Dr. Sarah Johnson',
                'password' => Hash::make('password'),
                'phone' => '+91 98765 43210',
                'date_of_birth' => '1985-06-15',
                'gender' => 'female',
                'role' => 'dermatologist',
                'is_active' => true,
            ]
        );

        // Create or update dermatologist profile
        $dermatologist->dermatologistProfile()->updateOrCreate(
            ['user_id' => $dermatologist->id],
            [
                'license_number' => 'DR123456',
                'specialization' => 'Hair Loss & Scalp Disorders',
                'years_of_experience' => 8,
                'qualifications' => 'MD Dermatology, Fellowship in Trichology',
                'consultation_fee' => 1500,
                'bio' => 'Specialized in hair loss treatment and scalp disorders with 8+ years of experience.',
            ]
        );

        // Create or update additional test dermatologist
        $dermatologist2 = User::updateOrCreate(
            ['email' => 'dermatologist2@hairskinhealth.com'],
            [
                'name' => 'Dr. Michael Chen',
                'password' => Hash::make('password'),
                'phone' => '+91 98765 43211',
                'date_of_birth' => '1980-03-22',
                'gender' => 'male',
                'role' => 'dermatologist',
                'is_active' => true,
            ]
        );

        $dermatologist2->dermatologistProfile()->updateOrCreate(
            ['user_id' => $dermatologist2->id],
            [
                'license_number' => 'DR123457',
                'specialization' => 'General Dermatology',
                'years_of_experience' => 12,
                'qualifications' => 'MD Dermatology, DNB',
                'consultation_fee' => 1200,
                'bio' => 'Experienced dermatologist specializing in general skin conditions and hair disorders.',
            ]
        );
    }
}
