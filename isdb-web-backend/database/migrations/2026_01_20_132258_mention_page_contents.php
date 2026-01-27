<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mention_page_contents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mention_id')
                ->constrained()
                ->cascadeOnDelete()
                ->unique();

            /*
            |--------------------------------------------------------------------------
            | HERO SECTION
            |--------------------------------------------------------------------------
            */
            $table->string('hero_title');
            $table->string('hero_subtitle')->nullable();
            $table->text('hero_description')->nullable();

            /*
            |--------------------------------------------------------------------------
            | SECTION INTRO FORMATIONS
            |--------------------------------------------------------------------------
            */
            $table->string('section_title')->nullable();
            $table->text('section_description')->nullable();

            /*
            |--------------------------------------------------------------------------
            | CALL TO ACTION
            |--------------------------------------------------------------------------
            */
            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();

            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->json('seo_keywords')->nullable();

            /*
            |--------------------------------------------------------------------------
            | THEME (UI / UX)
            |--------------------------------------------------------------------------
            | Valeurs possibles :
            | green | red | gold | orange
            */
            $table->string('theme', 20)->default('green');

            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mention_page_contents');
    }
};
