<?php

namespace App\Models\Concerns;

use App\Support\FrontendCache;

trait PurgeFrontendCache
{
    protected static function bootPurgeFrontendCache(): void
    {
        $purger = fn ($model) => FrontendCache::purge($model->frontendCacheTags);

        foreach (['saved', 'deleted', 'restored'] as $event) {
            static::registerModelEvent($event, $purger);
        }
    }
}
