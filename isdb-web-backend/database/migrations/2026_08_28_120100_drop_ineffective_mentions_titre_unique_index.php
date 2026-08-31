<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Même problème que pour domaines.nom : l'index unique composite
     * (titre, deleted_at) ne protège en réalité rien, MySQL considérant
     * chaque NULL comme distinct dans un index unique — deux mentions
     * actives (deleted_at IS NULL) pourraient porter le même titre sans que
     * la base ne s'y oppose. La vraie protection vient de la validation
     * applicative (Rule::unique('mentions', 'titre')->whereNull('deleted_at')).
     */
    public function up(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            $table->dropUnique('mentions_titre_deleted_at_unique');
        });
    }

    public function down(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            $table->unique(['titre', 'deleted_at'], 'mentions_titre_deleted_at_unique');
        });
    }
};
