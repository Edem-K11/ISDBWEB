<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // D'abord, mettre à jour les données
        DB::table('formations')
            ->where('diplome', 'MASTER')
            ->update(['diplome' => 'MASTER_PROFESSIONNEL']);

        // Ensuite, modifier l'ENUM
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE formations MODIFY COLUMN diplome ENUM(
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER_RECHERCHE',
                'MASTER_PROFESSIONNEL',
                'CERTIFICAT_MODULE'
            ) NULL");
        }
    }

    public function down(): void
    {
        DB::table('formations')
            ->whereIn('diplome', ['MASTER_RECHERCHE', 'MASTER_PROFESSIONNEL'])
            ->update(['diplome' => 'MASTER']);

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE formations MODIFY COLUMN diplome ENUM(
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER',
                'CERTIFICAT_MODULE'
            ) NULL");
        }
    }
};
