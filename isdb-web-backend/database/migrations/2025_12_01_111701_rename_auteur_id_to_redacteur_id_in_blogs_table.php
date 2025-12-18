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
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropForeign(['auteur_id']);
            $table->renameColumn('auteur_id', 'redacteur_id');
            $table->foreign('redacteur_id')->references('id')->on('redacteurs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropForeign(['redacteur_id']);
            $table->renameColumn('redacteur_id', 'auteur_id');
            $table->foreign('auteur_id')->references('id')->on('auteurs');
        });
    }
};
