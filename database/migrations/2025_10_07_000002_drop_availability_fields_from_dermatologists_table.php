<?php

// Generated via prompt: prompts/dermatologists_drop_availability_columns_v1.md

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
        $columnsToDrop = [
            'available_days',
            'start_time',
            'end_time',
            'timezone',
            'is_available',
            'max_patients_per_day',
        ];

        foreach ($columnsToDrop as $column) {
            if (Schema::hasColumn('dermatologists', $column)) {
                Schema::table('dermatologists', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('dermatologists', 'available_days')) {
            Schema::table('dermatologists', function (Blueprint $table) {
                $table->json('available_days')->nullable();
            });
        }

        if (! Schema::hasColumn('dermatologists', 'start_time')) {
            Schema::table('dermatologists', function (Blueprint $table) {
                $table->time('start_time')->nullable();
            });
        }

        if (! Schema::hasColumn('dermatologists', 'end_time')) {
            Schema::table('dermatologists', function (Blueprint $table) {
                $table->time('end_time')->nullable();
            });
        }

        if (! Schema::hasColumn('dermatologists', 'timezone')) {
            Schema::table('dermatologists', function (Blueprint $table) {
                $table->string('timezone')->nullable();
            });
        }

        if (! Schema::hasColumn('dermatologists', 'is_available')) {
            Schema::table('dermatologists', function (Blueprint $table) {
                $table->boolean('is_available')->default(true);
            });
        }

        if (! Schema::hasColumn('dermatologists', 'max_patients_per_day')) {
            Schema::table('dermatologists', function (Blueprint $table) {
                $table->integer('max_patients_per_day')->default(10);
            });
        }
    }
};
