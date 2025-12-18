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
        Schema::table('auteurs', function (Blueprint $table) {
            $table->string('password')->after('email');
            $table->enum('role', ['admin', 'auteur'])->default('auteur')->after('password');
            $table->boolean('est_actif')->default(true)->after('role');
            $table->timestamp('email_verified_at')->nullable()->after('email');
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auteurs', function (Blueprint $table) {
            $table->dropColumn(['password', 'role', 'est_actif', 'email_verified_at', 'remember_token']);
        });
    }
};
