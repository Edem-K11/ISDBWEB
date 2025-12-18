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
        Schema::table('mentions', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->foreignId('domaine_id')
                ->constrained('domaines')
                ->onDelete('cascade'); // Si un domaine est supprimé, ses mentions aussi
            $table->softDeletes();

            $table->index('domaine_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            $table->dropColumn(['description', 'domaine_id']);
        });
    }
};
