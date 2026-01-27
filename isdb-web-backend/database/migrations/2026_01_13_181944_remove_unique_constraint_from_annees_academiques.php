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
        Schema::table('annees_academiques', function (Blueprint $table) {
            // Supprimer la contrainte unique composite
            $table->dropUnique(['annee_debut', 'annee_fin']);
            
            // Optionnel : Ajouter des index pour les performances
            $table->index('annee_debut');
            $table->index('annee_fin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('annees_academiques', function (Blueprint $table) {
            // Recréer la contrainte si besoin de rollback
            $table->unique(['annee_debut', 'annee_fin'], 'annees_academiques_annee_debut_annee_fin_unique');
            
            // Supprimer les index
            $table->dropIndex(['annee_debut']);
            $table->dropIndex(['annee_fin']);
        });
    }
};