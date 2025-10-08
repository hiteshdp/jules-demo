<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('razorpay_logs', function (Blueprint $table) {
            $table->id();
            $table->string('event');
            $table->json('payload');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('razorpay_logs');
    }
};


