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
        Schema::dropIfExists('formations');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id()->primary();
            $table->string("titre");
            $table->string("description")->nullable();
            $table->foreignId("domaine_id")->constrained("domaines")->onDelete("cascade");
            $table->foreignId("diplome_id")->constrained("diplomes")->onDelete("cascade");
            $table->foreignId("mention_id")->constrained("mentions")->onDelete("cascade");
            $table->text("condition_admission")->nullable();
            $table->text("profil_entree")->nullable();
            $table->text("spécilités")->nullable();
            $table->text("objectifs")->nullable();
            $table->text("profil_de_sortie")->nullable();
            $table->text("evaluation")->nullable();
            $table->text("programme")->nullable();
            $table->string("programme_ue")->nullable();
            $table->string("chefs_parcours")->nullable();
            $table->string("durrée_formation")->nullable();
            $table->text("frais_scolarité")->nullable();
            $table->timestamps();
        });
    }
};
