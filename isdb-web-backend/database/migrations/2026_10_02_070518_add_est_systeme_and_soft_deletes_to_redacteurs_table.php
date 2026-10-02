<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('redacteurs', function (Blueprint $table) {
            $table->boolean('est_systeme')->default(false)->after('est_actif');
            $table->softDeletes();
        });

        // Compte rédacteur système "La Rédaction" : byline institutionnelle utilisée
        // à la place du compte personnel de l'admin, et destination de repli pour
        // les articles d'un rédacteur supprimé. Email/mot de passe sont des valeurs
        // internes jamais communiquées (la colonne reste NOT NULL/unique) — le
        // formulaire dashboard masque ces champs pour ce compte précis.
        if (! DB::table('redacteurs')->where('est_systeme', true)->exists()) {
            DB::table('redacteurs')->insert([
                'nom' => 'La Rédaction',
                'email' => 'redaction@isdb.local',
                'password' => Hash::make(Str::random(40)),
                'role' => 'redacteur',
                'est_actif' => true,
                'est_systeme' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('redacteurs')->where('est_systeme', true)->delete();

        Schema::table('redacteurs', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn('est_systeme');
        });
    }
};
