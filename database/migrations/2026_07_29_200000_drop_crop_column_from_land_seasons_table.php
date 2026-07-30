<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('land_seasons', function (Blueprint $table) {
            $table->dropColumn('crop');
        });
    }

    public function down(): void
    {
        Schema::table('land_seasons', function (Blueprint $table) {
            $table->string('crop')->nullable()->after('crop_id');
        });
    }
};
