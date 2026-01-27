<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Mention;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('titre');
        });

        /**
         * Génération des slugs pour les mentions existantes
         */
        Mention::withTrashed()->get()->each(function ($mention) {
            $baseSlug = Str::slug($mention->titre);
            $slug = $baseSlug;
            $counter = 1;

            while (
                Mention::withTrashed()
                    ->where('slug', $slug)
                    ->where('id', '!=', $mention->id)
                    ->exists()
            ) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $mention->slug = $slug;
            $mention->saveQuietly();
        });

        Schema::table('mentions', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('mentions', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
