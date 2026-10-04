<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Liste publique des articles : WHERE statut = 'publie' ORDER BY date_creation DESC.
     * L'index composé couvre filtre + tri sans tri en mémoire.
     * blog_tag n'avait d'index que sur (blog_id, tag_id) : le filtre par tag
     * seul (tag_id) n'était pas indexé.
     */
    public function up(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->index(['statut', 'date_creation'], 'blogs_statut_date_creation_index');
        });

        Schema::table('blog_tag', function (Blueprint $table) {
            $table->index('tag_id', 'blog_tag_tag_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('blog_tag', function (Blueprint $table) {
            $table->dropIndex('blog_tag_tag_id_index');
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropIndex('blogs_statut_date_creation_index');
        });
    }
};
