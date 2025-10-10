<?php
// Generated via prompt: prompts/laravel_skeleton_generation_v1.md

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\AdminSettingSeeder;
use Database\Seeders\HairLossQuizQuestionSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            DermatologistSeeder::class,
            AdminSettingSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            HairLossQuizQuestionSeeder::class,
        ]);
    }
}
