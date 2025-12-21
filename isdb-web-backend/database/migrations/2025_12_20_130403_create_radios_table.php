<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('radios', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('url_stream', 500); // URL du flux radio
            $table->string('image', 255)->nullable(); // URL ou chemin de l'image
            $table->boolean('en_direct')->default(true); // Si la radio diffuse
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insérer la radio par défaut
        DB::table('radios')->insert([
            'nom' => 'Radio ISDB',
            'url_stream' => 'https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3',
            'image' => null,
            'en_direct' => true,
            'description' => 'La radio de l\'institut',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('radios');
    }
};