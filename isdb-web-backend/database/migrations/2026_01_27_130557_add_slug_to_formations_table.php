<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Formation;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('titre');
        });

        /**
         * Génération des slugs pour les mentions existantes
         */
        Formation::withTrashed()->get()->each(function ($formation) {
            $baseSlug = Str::slug($formation->titre);
            $slug = $baseSlug;
            $counter = 1;

            while (
                Formation::withTrashed()
                    ->where('slug', $slug)
                    ->where('id', '!=', $formation->id)
                    ->exists()
            ) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $formation->slug = $slug;
            $formation->saveQuietly();
        });

        Schema::table('formations', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
