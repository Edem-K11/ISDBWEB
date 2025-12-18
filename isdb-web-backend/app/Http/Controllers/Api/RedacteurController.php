<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRedacteurRequest;
use App\Http\Requests\UpdateRedacteurRequest;
use App\Http\Resources\RedacteurResource;
use App\Models\Redacteur;

class RedacteurController extends Controller
{
    public function index()
    {
        $redacteurs = Redacteur::withCount('blogs')->get();
        return RedacteurResource::collection($redacteurs);
    }

    public function store(StoreRedacteurRequest $request)
    {
        $redacteur = Redacteur::create($request->validated());
        
        return response()->json([
            'message' => 'Redacteur créé avec succès',
            'data' => new RedacteurResource($redacteur)
        ], 201);
    }

    public function show($id)
    {
        $redacteur = Redacteur::with(['blogs' => function($query) {
            $query->where('statut', 'publie')->orderBy('date_creation', 'desc');
        }])->findOrFail($id);
        
        return new RedacteurResource($redacteur);
    }

    public function update(UpdateRedacteurRequest $request, $id)
    {
        $redacteur = Redacteur::findOrFail($id);
        $redacteur->update($request->validated());
        
        return response()->json([
            'message' => 'Redacteur mis à jour avec succès',
            'data' => new RedacteurResource($redacteur)
        ]);
    }

    public function destroy($id)
    {
        $redacteur = Redacteur::findOrFail($id);
        $redacteur->delete();
        
        return response()->json([
            'message' => 'Redacteur supprimé avec succès'
        ]);
    }
}

