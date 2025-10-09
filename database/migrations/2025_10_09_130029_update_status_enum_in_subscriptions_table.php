<?php

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
        // Update ENUM field to include 'failed'
        DB::statement("ALTER TABLE subscriptions 
            MODIFY COLUMN status 
            ENUM('active', 'cancelled', 'pending', 'failed') 
            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            // Revert to previous ENUM values
            DB::statement("ALTER TABLE subscriptions 
            MODIFY COLUMN status 
            ENUM('active', 'cancelled', 'expired', 'pending') 
            CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending'");
        });
    }
};
