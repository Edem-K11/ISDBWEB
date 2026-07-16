<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Domaine;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('domaines', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('nom');
        });

        // Génération des slugs pour les domaines existants
        Domaine::withTrashed()->get()->each(function ($domaine) {
            $baseSlug = Str::slug($domaine->nom);
            $slug = $baseSlug;
            $counter = 1;

            while (
                Domaine::withTrashed()
                    ->where('slug', $slug)
                    ->where('id', '!=', $domaine->id)
                    ->exists()
            ) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $domaine->slug = $slug;
            $domaine->saveQuietly();
        });

        Schema::table('domaines', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('domaines', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
