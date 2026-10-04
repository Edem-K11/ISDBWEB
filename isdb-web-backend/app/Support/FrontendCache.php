<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FrontendCache
{
    public static function purge(array $tags): void
    {
        $url = config('services.frontend_cache.url');
        $secret = config('services.frontend_cache.secret');

        if (! $url || ! $secret || $tags === []) {
            return;
        }

        // Après commit : sinon le site pourrait remettre en cache l'ancienne version
        // juste avant que la nouvelle ne soit enregistrée.
        DB::afterCommit(function () use ($url, $secret, $tags) {
            try {
                Http::timeout(5)
                    ->withHeaders(['x-revalidate-secret' => $secret])
                    ->post($url, ['tags' => array_values(array_unique($tags))])
                    ->throw();
            } catch (\Throwable $e) {
                // Ne jamais faire échouer l'enregistrement : le délai de 60 s sert de filet.
                Log::warning('Purge du cache frontend impossible', ['tags' => $tags, 'erreur' => $e->getMessage()]);
            }
        });
    }
}
