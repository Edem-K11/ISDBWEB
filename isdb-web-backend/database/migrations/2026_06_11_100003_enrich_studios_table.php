<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('studios', function (Blueprint $table) {
            $table->string('slug')->unique()->after('nom');
            $table->unsignedTinyInteger('ordre')->default(0)->after('description');
            $table->boolean('lien_radio')->default(false)->after('ordre');
            $table->boolean('est_actif')->default(true)->after('lien_radio');
        });

        Schema::table('studios', function (Blueprint $table) {
            $table->dropColumn('images');
        });

        Schema::table('studios', function (Blueprint $table) {
            $table->json('images')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('studios', function (Blueprint $table) {
            $table->dropColumn('images');
        });

        Schema::table('studios', function (Blueprint $table) {
            $table->string('images')->nullable()->after('description');
        });

        Schema::table('studios', function (Blueprint $table) {
            $table->dropColumn(['slug', 'ordre', 'lien_radio', 'est_actif']);
        });
    }
};
