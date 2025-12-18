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
        Schema::create('formations', function (Blueprint $table) {
           $table->id();
            $table->string('titre', 300);
            
            // Type de formation : PRINCIPALE ou MODULAIRE
            $table->enum('type_formation', ['PRINCIPALE', 'MODULAIRE']);
            
            $table->text('description')->nullable();
            
            // Mention (obligatoire pour PRINCIPALE, null pour MODULAIRE)
            $table->foreignId('mention_id')
                ->nullable()
                ->constrained('mentions')
                ->onDelete('cascade');
            
            // Diplôme
            $table->enum('diplome', [
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER',
                'CERTIFICAT_MODULE'
            ])->nullable();
            
            // Informations pédagogiques
            $table->longText('condition_admission')->nullable();
            $table->longText('profile_intree')->nullable();
            $table->longText('specialite')->nullable();
            $table->longText('objectifs')->nullable();
            $table->longText('profile_sortie')->nullable();
            $table->longText('evaluation')->nullable();
            $table->longText('programme')->nullable();
            $table->string('programme_pdf', 255)->nullable(); // Chemin vers le PDF
            
            // Informations pratiques
            $table->string('duree_formation', 50)->nullable(); // Ex: "2 ans", "3 mois"
            $table->longText('frais_scolarite')->nullable(); // Note générale sur les frais
            
            // Statut de la formation
            $table->enum('statut_formation', ['ACTIVE', 'ARCHIVEE', 'SUPPRIMEE'])
                ->default('ACTIVE');
            
            $table->timestamps();
            $table->softDeletes(); // deleted_at pour le soft delete
            
            // Index pour améliorer les performances
            $table->index('type_formation');
            $table->index('statut_formation');
            $table->index('mention_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
