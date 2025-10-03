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
        Schema::create('hair_loss_quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->enum('type', ['single_choice', 'multiple_choice', 'text', 'scale']);
            $table->json('options')->nullable(); // For single/multiple choice questions
            $table->integer('order')->default(0);
            $table->boolean('is_required')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hair_loss_quiz_questions');
    }
};
