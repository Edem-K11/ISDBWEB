<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offres_formations', function (Blueprint $table) {
            $table->decimal('frais_inscription', 10, 2)->nullable()->after('prix');
        });
    }

    public function down(): void
    {
        Schema::table('offres_formations', function (Blueprint $table) {
            $table->dropColumn('frais_inscription');
        });
    }
};
