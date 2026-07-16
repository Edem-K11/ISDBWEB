<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->unsignedTinyInteger('numero_module')->nullable()->after('type_formation');
            $table->longText('contenu')->nullable()->after('description');
            $table->longText('objectif_general')->nullable()->after('objectifs');
            $table->longText('objectif_specifique')->nullable()->after('objectif_general');
            $table->longText('competences_visees')->nullable()->after('objectif_specifique');
            $table->longText('debouches')->nullable()->after('competences_visees');
            $table->unsignedInteger('duree_heures')->nullable()->after('duree_formation');
            $table->string('programme_image', 255)->nullable()->after('programme_pdf');
        });
    }

    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn([
                'numero_module',
                'contenu',
                'objectif_general',
                'objectif_specifique',
                'competences_visees',
                'debouches',
                'duree_heures',
                'programme_image',
            ]);
        });
    }
};
