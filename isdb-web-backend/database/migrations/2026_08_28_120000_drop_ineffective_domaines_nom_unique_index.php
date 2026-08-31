<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * L'index unique composite (nom, deleted_at) ajouté précédemment pour
     * autoriser la réutilisation d'un nom après suppression douce ne protège
     * en réalité rien : MySQL considère chaque NULL comme distinct dans un
     * index unique, donc deux domaines actifs (deleted_at IS NULL) pourraient
     * porter le même nom sans que la base ne s'y oppose (vérifié). La vraie
     * protection vient déjà de la validation applicative
     * (Rule::unique('domaines', 'nom')->whereNull('deleted_at')), exactement
     * comme pour le titre des formations qui n'a lui-même aucune contrainte
     * unique en base.
     */
    public function up(): void
    {
        Schema::table('domaines', function (Blueprint $table) {
            $table->dropUnique('domaines_nom_deleted_at_unique');
        });
    }

    public function down(): void
    {
        Schema::table('domaines', function (Blueprint $table) {
            $table->unique(['nom', 'deleted_at'], 'domaines_nom_deleted_at_unique');
        });
    }
};
