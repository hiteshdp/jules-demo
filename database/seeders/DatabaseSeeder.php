<?php
// Generated via prompt: prompts/laravel_skeleton_generation_v1.md

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DermatologistSeeder::class,
        ]);
    }
}