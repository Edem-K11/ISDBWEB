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
        Schema::create('annees_academiques', function (Blueprint $table) {
            $table->id();
            $table->integer('annee_debut'); // Ex: 2024
            $table->integer('annee_fin');   // Ex: 2025
            $table->boolean('est_actuelle')->default(false);
            $table->date('date_debut'); // Date réelle de début (ex: 01/10/2024)
            $table->date('date_fin');   // Date réelle de fin (ex: 30/09/2025)
            $table->timestamps();
            $table->softDeletes();

            // Contrainte unique pour éviter les doublons d'années
            $table->unique(['annee_debut', 'annee_fin']);
            
            // Index pour la recherche de l'année actuelle
            $table->index('est_actuelle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annees_academiques');
    }
};
