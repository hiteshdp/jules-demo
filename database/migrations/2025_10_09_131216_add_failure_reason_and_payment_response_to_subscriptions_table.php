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
        Schema::table('subscriptions', function (Blueprint $table) {
            // Add failure_reason (nullable text)
            $table->text('failure_reason')
                ->nullable()
                ->after('ends_at')
                ->comment('Reason for failed payment if applicable');

            // Add payment_response (nullable JSON)
            $table->json('payment_response')
                ->nullable()
                ->after('failure_reason')
                ->comment('Full Razorpay payment response payload');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['failure_reason', 'payment_response']);
        });
    }
};
