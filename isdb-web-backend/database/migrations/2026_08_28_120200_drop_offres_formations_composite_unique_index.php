<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * La contrainte unique brute (formation_id, annee_academique_id) ne tient
     * pas compte de deleted_at : une fois une offre soft-supprimée, la ligne
     * existe toujours physiquement en base et bloque toute recréation de la
     * même formation pour la même année (erreur 1062 "Duplicate entry").
     *
     * On la supprime et on s'appuie uniquement sur la validation applicative
     * déjà en place (StoreOffreFormationRequest / UpdateOffreFormationRequest),
     * qui exclut correctement les offres soft-supprimées — même principe que
     * pour domaines.nom et mentions.titre.
     */
    public function up(): void
    {
        Schema::table('offres_formations', function (Blueprint $table) {
            $table->dropUnique('offre_unique_par_annee');
        });
    }

    public function down(): void
    {
        Schema::table('offres_formations', function (Blueprint $table) {
            $table->unique(['formation_id', 'annee_academique_id'], 'offre_unique_par_annee');
        });
    }
};
