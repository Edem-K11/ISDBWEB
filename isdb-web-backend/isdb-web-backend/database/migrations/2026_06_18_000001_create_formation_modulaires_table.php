<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formation_modulaires', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->longText('contenu')->nullable();
            $table->longText('condition_admission')->nullable();
            $table->longText('objectifs')->nullable();
            $table->longText('competences_visees')->nullable();
            $table->longText('debouches')->nullable();
            $table->longText('profile_sortie')->nullable();
            $table->longText('evaluation')->nullable();
            $table->longText('programme')->nullable();
            $table->string('programme_pdf')->nullable();
            $table->integer('duree_heures')->nullable();
            $table->decimal('frais_inscription', 10, 2)->nullable();
            $table->decimal('frais_formation', 10, 2)->nullable();
            $table->enum('statut_formation', ['ACTIVE', 'ARCHIVEE', 'SUPPRIMEE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formation_modulaires');
    }
};
