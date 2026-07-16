<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('radios', function (Blueprint $table) {
            $table->text('message_app_mobile')->nullable()->after('description');
            $table->string('app_store_url', 500)->nullable()->after('message_app_mobile');
            $table->string('play_store_url', 500)->nullable()->after('app_store_url');
        });
    }

    public function down(): void
    {
        Schema::table('radios', function (Blueprint $table) {
            $table->dropColumn(['message_app_mobile', 'app_store_url', 'play_store_url']);
        });
    }
};
