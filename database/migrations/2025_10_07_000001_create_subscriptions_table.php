<?php
// Generated via prompt: prompts/razorpay_recurring_payments_v1.md

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('razorpay_plan_id')->nullable();
            $table->string('razorpay_subscription_id')->nullable()->index();
            $table->unsignedInteger('amount');
            $table->enum('status', ['created', 'active', 'cancelled', 'failed'])->default('created');
            $table->timestamp('next_payment_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};


