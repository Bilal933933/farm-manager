<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('land_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('land_season_id')->nullable()->constrained('land_seasons')->nullOnDelete();
            $table->string('type');
            $table->string('reason');
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 12, 2)->nullable()->after('quantity');
            $table->date('movement_date');
            $table->nullableMorphs('reference');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('reason');
            $table->index('movement_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
