<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Dates communiquées sur la page publique /admission ("Dates importantes") :
     * ouverture/clôture des inscriptions et rentrée des cours. Renseignées
     * depuis le dashboard (Paramètres) plutôt que codées en dur côté frontend.
     */
    public function up(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->date('date_ouverture_inscriptions')->nullable()->after('email_2');
            $table->date('date_cloture_inscriptions')->nullable()->after('date_ouverture_inscriptions');
            $table->date('date_rentree')->nullable()->after('date_cloture_inscriptions');
        });
    }

    public function down(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->dropColumn(['date_ouverture_inscriptions', 'date_cloture_inscriptions', 'date_rentree']);
        });
    }
};
