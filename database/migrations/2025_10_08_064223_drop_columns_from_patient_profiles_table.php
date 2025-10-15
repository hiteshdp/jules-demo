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
            // Drop columns only if they exist
            $columnsToDrop = [];

            if (Schema::hasColumn('patient_profiles', 'medical_history')) {
                $columnsToDrop[] = 'medical_history';
            }
            if (Schema::hasColumn('patient_profiles', 'lifestyle')) {
                $columnsToDrop[] = 'lifestyle';
            }
            if (Schema::hasColumn('patient_profiles', 'dietary_habits')) {
                $columnsToDrop[] = 'dietary_habits';
            }
            if (Schema::hasColumn('patient_profiles', 'stress_level')) {
                $columnsToDrop[] = 'stress_level';
            }
            if (Schema::hasColumn('patient_profiles', 'sleep_pattern')) {
                $columnsToDrop[] = 'sleep_pattern';
            }
            if (Schema::hasColumn('patient_profiles', 'hair_care_routine')) {
                $columnsToDrop[] = 'hair_care_routine';
            }
            if (Schema::hasColumn('patient_profiles', 'family_history')) {
                $columnsToDrop[] = 'family_history';
            }

            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_profiles', function (Blueprint $table) {
            // Add columns only if they don't exist
            if (! Schema::hasColumn('patient_profiles', 'medical_history')) {
                $table->text('medical_history')->nullable();
            }
            if (! Schema::hasColumn('patient_profiles', 'lifestyle')) {
                $table->enum('lifestyle', ['sedentary', 'moderate', 'active', 'very_active'])->nullable();
            }
            if (! Schema::hasColumn('patient_profiles', 'dietary_habits')) {
                $table->text('dietary_habits')->nullable();
            }
            if (! Schema::hasColumn('patient_profiles', 'stress_level')) {
                $table->text('stress_level')->nullable();
            }
            if (! Schema::hasColumn('patient_profiles', 'sleep_pattern')) {
                $table->text('sleep_pattern')->nullable();
            }
            if (! Schema::hasColumn('patient_profiles', 'hair_care_routine')) {
                $table->text('hair_care_routine')->nullable();
            }
            if (! Schema::hasColumn('patient_profiles', 'family_history')) {
                $table->text('family_history')->nullable();
            }
        });
    }
};
