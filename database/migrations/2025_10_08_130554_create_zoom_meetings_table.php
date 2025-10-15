<?php

// Generated via prompt: prompts/zoom_meeting_database_v1.md

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
        Schema::create('zoom_meetings', function (Blueprint $table) {
            $table->id();
            $table->string('meeting_id')->unique();
            $table->string('topic');
            $table->text('join_url');
            $table->text('start_url');
            $table->string('password')->nullable();
            $table->datetime('start_time');
            $table->integer('duration');
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade');
            $table->foreignId('dermatologist_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['created', 'started', 'ended'])->default('created');
            $table->datetime('started_at')->nullable();
            $table->datetime('ended_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zoom_meetings');
    }
};
