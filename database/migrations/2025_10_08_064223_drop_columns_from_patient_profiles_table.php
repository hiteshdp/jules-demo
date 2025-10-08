<?php
// Generated via prompt: prompts/patient_columns_cleanup_v1.md

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'medical_history',
                'lifestyle',
                'dietary_habits',
                'stress_level',
                'sleep_pattern',
                'hair_care_routine',
                'family_history'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_profiles', function (Blueprint $table) {
            $table->text('medical_history')->nullable();
            $table->enum('lifestyle', ['sedentary', 'moderate', 'active', 'very_active'])->nullable();
            $table->text('dietary_habits')->nullable();
            $table->text('stress_level')->nullable();
            $table->text('sleep_pattern')->nullable();
            $table->text('hair_care_routine')->nullable();
            $table->text('family_history')->nullable();
        });
    }
};
