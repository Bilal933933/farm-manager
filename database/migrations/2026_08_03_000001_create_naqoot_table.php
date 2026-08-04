<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('naqoot', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location')->nullable();
            $table->date('date');
            $table->decimal('amount', 10, 2);
            $table->string('direction');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('direction');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('naqoot');
    }
};
