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

        $data = $request->validated();
        if ($redacteur->est_systeme) {
            // Le compte système n'a pas d'identifiants de connexion réels :
            // seuls nom/avatar/bio/statut sont modifiables, même via un appel
            // API direct qui contournerait le formulaire dashboard.
            $data = collect($data)->only(['nom', 'avatar', 'bio', 'est_actif'])->all();
        }

        $redacteur->update($data);
        
        return response()->json([
            'message' => 'Redacteur mis à jour avec succès',
            'data' => new RedacteurResource($redacteur)
        ]);
    }

    public function destroy($id)
    {
        $redacteur = Redacteur::findOrFail($id);

        if ($redacteur->role === 'admin') {
            return response()->json([
                'message' => 'Impossible de supprimer un administrateur',
                'error' => 'admin_cannot_be_deleted'
            ], 403);
        }

        if ($redacteur->est_systeme) {
            return response()->json([
                'message' => 'Impossible de supprimer ce compte système',
                'error' => 'system_account_cannot_be_deleted'
            ], 403);
        }

        // blogs.redacteur_id a une contrainte de clé étrangère sans cascade : on
        // réaffecte les articles au compte système "La Rédaction" avant de
        // supprimer (soft delete), plutôt que de bloquer ou de perdre le contenu.
        $blogsCount = $redacteur->blogs()->count();
        if ($blogsCount > 0) {
            $laRedaction = Redacteur::where('est_systeme', true)->first();

            if (! $laRedaction) {
                // Filet de sécurité si jamais le compte système n'existe pas
                // (migration pas encore passée) : on bloque plutôt que de perdre
                // la référence d'auteur.
                return response()->json([
                    'message' => "Impossible de supprimer ce rédacteur : {$blogsCount} article(s) lui sont encore associé(s), et aucun compte de repli (\"La Rédaction\") n'a été trouvé.",
                    'error' => 'redacteur_has_blogs',
                    'blogs_count' => $blogsCount,
                ], 409);
            }

            $redacteur->blogs()->update(['redacteur_id' => $laRedaction->id]);
        }

        $redacteur->delete();

        return response()->json([
            'message' => $blogsCount > 0
                ? "Rédacteur supprimé avec succès. {$blogsCount} article(s) réaffecté(s) à La Rédaction."
                : 'Redacteur supprimé avec succès'
        ]);
    }
}

