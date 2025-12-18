<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('domaines', function (Blueprint $table) {

            // Supprimer l'index unique existant
            $table->dropUnique('domaines_nom_unique');

            // Créer un index unique compatible soft delete
            $table->unique(['nom', 'deleted_at'], 'domaines_nom_deleted_at_unique');
        });
    }

    public function down(): void
    {
        Schema::table('domaines', function (Blueprint $table) {
            $table->dropUnique('domaines_nom_deleted_at_unique');
            $table->unique('nom', 'domaines_nom_unique');
        });
    }
};
