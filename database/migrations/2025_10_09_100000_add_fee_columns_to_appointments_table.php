<?php
// Generated via prompt: prompts/appointments_fee_breakdown_v1.md

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
        Schema::table('appointments', function (Blueprint $table) {
            $table->decimal('platform_fee', 8, 2)->default(0)->after('consultation_fee');
            $table->decimal('dermatologist_fee', 8, 2)->default(0)->after('platform_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['platform_fee', 'dermatologist_fee']);
        });
    }
};


