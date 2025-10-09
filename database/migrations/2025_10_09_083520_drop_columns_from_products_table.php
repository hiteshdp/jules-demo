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
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'brand',
                'ingredients',
                'usage_instructions',
                'requires_prescription',
                'stock_quantity',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('brand');
            $table->text('ingredients');
            $table->text('usage_instructions');
            $table->text('dosage')->nullable();
            $table->text('restrictions')->nullable();
            $table->boolean('requires_prescription')->default(false);
            $table->integer('stock_quantity')->default(0);
        });
    }
};
