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
        Schema::table('land_contracts', function (Blueprint $table) {
            $table->foreign('party_id')->references('id')->on('parties')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('land_contracts', function (Blueprint $table) {
            $table->dropForeign(['party_id']);
        });
    }
};
