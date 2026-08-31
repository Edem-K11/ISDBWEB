<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ISDB dispose de deux numéros de téléphone et deux adresses email mis à
     * disposition du public — on ajoute un second champ pour chacun, en plus
     * des colonnes telephone/email déjà existantes (considérées comme le
     * contact "principal").
     */
    public function up(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->string('telephone_2')->nullable()->after('telephone');
            $table->string('email_2')->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->dropColumn(['telephone_2', 'email_2']);
        });
    }
};
