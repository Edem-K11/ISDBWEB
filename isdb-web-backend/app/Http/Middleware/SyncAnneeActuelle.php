<?php

namespace App\Http\Middleware;

use App\Models\AnneeAcademique;
use Closure;
use Illuminate\Http\Request;

class SyncAnneeActuelle
{
    public function handle(Request $request, Closure $next)
    {
        AnneeAcademique::synchroniserSiNecessaire();

        return $next($request);
    }
}
