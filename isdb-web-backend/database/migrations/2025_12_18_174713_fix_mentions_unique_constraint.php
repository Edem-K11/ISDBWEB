<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            // Supprimer l'index unique existant sur titre
            $table->dropUnique('mentions_titre_unique');

            // Créer un index unique composite compatible soft delete
            $table->unique(['titre', 'deleted_at'], 'mentions_titre_deleted_at_unique');
        });
    }

    public function down(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            $table->dropUnique('mentions_titre_deleted_at_unique');
            $table->unique('titre', 'mentions_titre_unique');
        });
    }
};