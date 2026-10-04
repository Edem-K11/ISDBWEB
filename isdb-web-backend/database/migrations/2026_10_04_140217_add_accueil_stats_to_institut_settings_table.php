<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->json('accueil_stats')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->dropColumn('accueil_stats');
        });
    }
};
