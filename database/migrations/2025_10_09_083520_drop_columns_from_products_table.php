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
            // Drop columns only if they exist
            $columnsToDrop = [];

            if (Schema::hasColumn('products', 'brand')) {
                $columnsToDrop[] = 'brand';
            }
            if (Schema::hasColumn('products', 'ingredients')) {
                $columnsToDrop[] = 'ingredients';
            }
            if (Schema::hasColumn('products', 'usage_instructions')) {
                $columnsToDrop[] = 'usage_instructions';
            }
            if (Schema::hasColumn('products', 'requires_prescription')) {
                $columnsToDrop[] = 'requires_prescription';
            }
            if (Schema::hasColumn('products', 'stock_quantity')) {
                $columnsToDrop[] = 'stock_quantity';
            }

            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add columns only if they don't exist
            if (! Schema::hasColumn('products', 'brand')) {
                $table->string('brand');
            }
            if (! Schema::hasColumn('products', 'ingredients')) {
                $table->text('ingredients');
            }
            if (! Schema::hasColumn('products', 'usage_instructions')) {
                $table->text('usage_instructions');
            }
            if (! Schema::hasColumn('products', 'dosage')) {
                $table->text('dosage')->nullable();
            }
            if (! Schema::hasColumn('products', 'restrictions')) {
                $table->text('restrictions')->nullable();
            }
            if (! Schema::hasColumn('products', 'requires_prescription')) {
                $table->boolean('requires_prescription')->default(false);
            }
            if (! Schema::hasColumn('products', 'stock_quantity')) {
                $table->integer('stock_quantity')->default(0);
            }
        });
    }
};
