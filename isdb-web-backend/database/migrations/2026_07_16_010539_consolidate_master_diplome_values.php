<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * L'institut ne distingue pas Master Recherche / Master Professionnel :
     * on revient à une seule valeur "MASTER" (4 diplômes au total).
     */
    public function up(): void
    {
        $isMysql = Schema::getConnection()->getDriverName() === 'mysql';

        if ($isMysql) {
            // Étape 1 : élargir l'ENUM pour accepter temporairement l'ancienne ET la nouvelle valeur
            DB::statement("ALTER TABLE formations MODIFY COLUMN diplome ENUM(
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER_RECHERCHE',
                'MASTER_PROFESSIONNEL',
                'MASTER',
                'CERTIFICAT_MODULE'
            ) NULL");
        }

        DB::table('formations')
            ->whereIn('diplome', ['MASTER_RECHERCHE', 'MASTER_PROFESSIONNEL'])
            ->update(['diplome' => 'MASTER']);

        if ($isMysql) {
            // Étape 2 : restreindre l'ENUM aux 4 valeurs définitives
            DB::statement("ALTER TABLE formations MODIFY COLUMN diplome ENUM(
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER',
                'CERTIFICAT_MODULE'
            ) NULL");
        }
    }

    public function down(): void
    {
        $isMysql = Schema::getConnection()->getDriverName() === 'mysql';

        if ($isMysql) {
            DB::statement("ALTER TABLE formations MODIFY COLUMN diplome ENUM(
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER_RECHERCHE',
                'MASTER_PROFESSIONNEL',
                'MASTER',
                'CERTIFICAT_MODULE'
            ) NULL");
        }

        DB::table('formations')
            ->where('diplome', 'MASTER')
            ->update(['diplome' => 'MASTER_PROFESSIONNEL']);

        if ($isMysql) {
            DB::statement("ALTER TABLE formations MODIFY COLUMN diplome ENUM(
                'LICENCE_PROFESSIONNELLE',
                'LICENCE_FONDAMENTALE',
                'MASTER_RECHERCHE',
                'MASTER_PROFESSIONNEL',
                'CERTIFICAT_MODULE'
            ) NULL");
        }
    }
};
