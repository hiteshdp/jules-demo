<?php
// Generated via prompt: prompts/hair_skin_health_setup_v1.md

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
        Schema::create('patient_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('medical_history')->nullable();
            $table->text('allergies')->nullable();
            $table->text('current_medications')->nullable();
            $table->enum('lifestyle', ['sedentary', 'moderate', 'active', 'very_active'])->nullable();
            $table->boolean('smoking')->default(false);
            $table->boolean('alcohol_consumption')->default(false);
            $table->text('dietary_habits')->nullable();
            $table->text('stress_level')->nullable();
            $table->text('sleep_pattern')->nullable();
            $table->text('hair_care_routine')->nullable();
            $table->text('family_history')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_profiles');
    }
};
