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
        Schema::table('land_seasons', function (Blueprint $table) {
            $table->decimal('actual_revenue', 12, 2)->nullable()->after('actual_cost');
            $table->decimal('actual_profit', 12, 2)->nullable()->after('actual_revenue');
        });
    }

    public function down(): void
    {
        Schema::table('land_seasons', function (Blueprint $table) {
            $table->dropColumn(['actual_revenue', 'actual_profit']);
        });
    }
};
