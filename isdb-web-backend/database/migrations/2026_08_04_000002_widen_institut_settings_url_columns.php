<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->text('site_web')->nullable()->change();
            $table->text('facebook_url')->nullable()->change();
            $table->text('twitter_url')->nullable()->change();
            $table->text('linkedin_url')->nullable()->change();
            $table->text('instagram_url')->nullable()->change();
            $table->text('youtube_url')->nullable()->change();
            $table->text('whatsapp')->nullable()->change();
            $table->text('tiktok_url')->nullable()->after('youtube_url');
        });
    }

    public function down(): void
    {
        Schema::table('institut_settings', function (Blueprint $table) {
            $table->string('site_web')->nullable()->change();
            $table->string('facebook_url')->nullable()->change();
            $table->string('twitter_url')->nullable()->change();
            $table->string('linkedin_url')->nullable()->change();
            $table->string('instagram_url')->nullable()->change();
            $table->string('youtube_url')->nullable()->change();
            $table->string('whatsapp')->nullable()->change();
            $table->dropColumn('tiktok_url');
        });
    }
};
