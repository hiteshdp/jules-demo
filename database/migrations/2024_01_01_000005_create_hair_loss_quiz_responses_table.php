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
        Schema::create('hair_loss_quiz_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained('hair_loss_quiz_questions')->onDelete('cascade');
            $table->text('answer');
            $table->integer('selected_option_id')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hair_loss_quiz_responses');
    }
};
