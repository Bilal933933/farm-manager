<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('direction');
            $table->decimal('amount', 12, 2);
            $table->string('description');
            $table->foreignId('party_id')->nullable()->constrained()->nullOnDelete();
            $table->nullableMorphs('reference');
            $table->timestamps();

            $table->index('date');
            $table->index('direction');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
    }
};
