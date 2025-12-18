<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         // 1. Convertir ENUM → VARCHAR
        DB::statement("
            ALTER TABLE redacteurs
            MODIFY COLUMN role VARCHAR(50) NULL;
        ");

        // 2. Corriger les anciennes valeurs
        DB::statement("
            UPDATE redacteurs SET role = 'redacteur' 
            WHERE role IS NULL OR role NOT IN ('admin', 'redacteur');
        ");

        // 3. Re-créer l'ENUM propre
        DB::statement("
            ALTER TABLE redacteurs
            MODIFY COLUMN role ENUM('admin', 'redacteur')
            NOT NULL DEFAULT 'redacteur';
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         DB::statement("
            ALTER TABLE redacteurs
            MODIFY COLUMN role VARCHAR(50) NULL;
        ");
    }   
};
