<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use App\Models\Formation;
use App\Models\FormationModulaire;
use App\Models\Mention;
use App\Models\OffreFormation;
use App\Models\Redacteur;
use Illuminate\Http\JsonResponse;

class CorbeilleController extends Controller
{
    // Compteurs de tous les onglets de la corbeille en une seule requête :
    // les listes elles-mêmes ne sont chargées que pour l'onglet affiché.
    public function counts(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'formations' => Formation::onlyTrashed()->count() + FormationModulaire::onlyTrashed()->count(),
                'domaines' => Domaine::onlyTrashed()->count(),
                'mentions' => Mention::onlyTrashed()->count(),
                'offres' => OffreFormation::onlyTrashed()->count(),
                'redacteurs' => Redacteur::onlyTrashed()->where('role', '!=', 'admin')->count(),
            ],
        ]);
    }
}
