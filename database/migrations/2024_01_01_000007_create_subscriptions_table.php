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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('plan_name'); // basic, premium, pro
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->enum('billing_cycle', ['monthly', 'quarterly', 'yearly']);
            $table->enum('status', ['active', 'cancelled', 'expired', 'pending'])->default('pending');
            $table->string('razorpay_subscription_id')->nullable();
            $table->string('razorpay_plan_id')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
