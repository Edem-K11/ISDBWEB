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
        Schema::create('offres_formations', function (Blueprint $table) {
            $table->id();
            
            // Relations
            $table->foreignId('formation_id')
                ->constrained('formations')
                ->onDelete('cascade');
                
            $table->foreignId('annee_academique_id')
                ->constrained('annees_academiques')
                ->onDelete('cascade');
            
            // Informations spécifiques à l'année
            $table->string('chef_parcours', 150)->nullable();
            $table->string('animateur', 150)->nullable(); // Pour formations modulaires
            
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            
            $table->integer('place_limited')->nullable(); // Nombre de places
            $table->decimal('prix', 10, 2)->nullable(); // Prix pour formations modulaires
            
            $table->boolean('est_dispensee')->default(true); // Si la formation est dispensée cette année
            
            $table->timestamps();
            $table->softDeletes();
            
            // Contrainte unique : une formation ne peut être offerte qu'une fois par année académique
            $table->unique(['formation_id', 'annee_academique_id'], 'offre_unique_par_annee');
            
            // Index pour les recherches fréquentes
            $table->index('formation_id');
            $table->index('annee_academique_id');
            $table->index('est_dispensee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres_formations');
    }
};
