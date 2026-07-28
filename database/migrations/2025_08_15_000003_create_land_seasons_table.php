<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('land_seasons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('land_id')->constrained()->cascadeOnDelete();
            $table->string('crop')->nullable();
            $table->date('planting_date');
            $table->date('harvest_date')->nullable();
            $table->decimal('expected_cost', 12, 2)->nullable();
            $table->decimal('actual_cost', 12, 2)->nullable();
            $table->decimal('actual_revenue', 12, 2)->nullable()->after('actual_cost');
            $table->decimal('actual_profit', 12, 2)->nullable()->after('actual_revenue');
            $table->string('status', 50)->default('قادم');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('farmer_id')->nullable();
            $table->foreignId('farmer_contract_id')->nullable()->constrained('land_contracts')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_seasons');
    }
};
