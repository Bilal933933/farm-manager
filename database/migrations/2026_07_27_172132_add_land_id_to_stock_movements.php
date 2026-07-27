<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->foreignId('land_id')->nullable()->constrained()->nullOnDelete()->after('product_id');
            $table->foreignId('land_season_id')->nullable()->constrained('land_seasons')->nullOnDelete()->after('land_id');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropForeign(['land_season_id']);
            $table->dropForeign(['land_id']);
            $table->dropColumn(['land_id', 'land_season_id']);
        });
    }
};
