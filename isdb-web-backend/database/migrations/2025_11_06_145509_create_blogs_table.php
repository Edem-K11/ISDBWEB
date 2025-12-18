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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('titre');
            $table->text('resume');
            $table->longText('contenu');
            $table->string('cover_image');
            $table->foreignId('auteur_id')->constrained('auteurs')->onDelete('cascade');
            $table->enum('statut', ['brouillon', 'publie'])->default('brouillon');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_modification')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();
            
            $table->index('slug');
            $table->index('statut');
            $table->index('auteur_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
