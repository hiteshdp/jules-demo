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
        Schema::create('dermatologists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('license_number')->unique();
            $table->string('specialization');
            $table->integer('years_of_experience');
            $table->text('qualifications');
            $table->text('bio')->nullable();
            $table->decimal('consultation_fee', 8, 2);
            $table->json('available_days'); // ['monday', 'tuesday', etc.]
            $table->time('start_time');
            $table->time('end_time');
            $table->string('timezone')->default('UTC');
            $table->boolean('is_available')->default(true);
            $table->integer('max_patients_per_day')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dermatologists');
    }
};
