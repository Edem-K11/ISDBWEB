<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage_contents', function (Blueprint $table) {
            $table->id();

            $table->string('hero_title');
            $table->string('hero_highlight')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('hero_cta_primary_label')->nullable();
            $table->string('hero_cta_primary_url')->nullable();
            $table->string('hero_cta_secondary_label')->nullable();
            $table->string('hero_cta_secondary_url')->nullable();

            $table->string('tagline')->nullable();
            $table->json('stats')->nullable();

            $table->string('features_title')->nullable();
            $table->text('features_description')->nullable();
            $table->json('features')->nullable();

            $table->string('formations_section_title')->nullable();
            $table->text('formations_section_description')->nullable();

            $table->string('cta_title')->nullable();
            $table->text('cta_description')->nullable();
            $table->string('cta_button_label')->nullable();
            $table->string('cta_button_url')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_contents');
    }
};
