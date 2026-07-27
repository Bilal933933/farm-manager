<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('land_seasons', function (Blueprint $table) {
            $table->foreignId('crop_id')->nullable()->constrained('crops')->nullOnDelete();
            $table->decimal('cultivated_area', 10, 2)->nullable()->after('crop_id');
        });
    }

    public function down(): void
    {
        Schema::table('land_seasons', function (Blueprint $table) {
            $table->dropForeign(['crop_id']);
            $table->dropColumn(['crop_id', 'cultivated_area']);
        });
    }
};
