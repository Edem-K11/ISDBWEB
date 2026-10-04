<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRedacteurRequest;
use App\Http\Requests\UpdateRedacteurRequest;
use App\Http\Resources\RedacteurResource;
use App\Models\Redacteur;
use Illuminate\Http\Request;

class RedacteurController extends Controller
{
    public function index(Request $request)
    {
        // Les comptes admin ne sont pas des bylines : tout contenu institutionnel
        // passe par le compte système "La Rédaction". Le compte admin reste
        // utilisable pour se connecter, il n'apparaît simplement plus dans la liste.
        $query = Redacteur::where('role', '!=', 'admin')->withCount('blogs')->orderBy('nom');

        // Pagination opt-in : les consommateurs qui listent tous les rédacteurs
        // (filtre d'auteur, compteur du tableau de bord) ne passent pas de page.
        if ($request->has('page') || $request->has('per_page')) {
            return RedacteurResource::collection(
                $query->paginate($request->integer('per_page', 15))
            );
        }

        return RedacteurResource::collection($query->get());
    }

    public function trashed()
    {
        $redacteurs = Redacteur::onlyTrashed()
            ->where('role', '!=', 'admin')
            ->withCount('blogs')
            ->orderBy('deleted_at', 'desc')
            ->get();

        return RedacteurResource::collection($redacteurs);
    }

    public function restore(int $id)
    {
        $redacteur = Redacteur::withTrashed()->findOrFail($id);

        if (! $redacteur->trashed()) {
            return response()->json(['message' => "Ce rédacteur n'est pas supprimé."], 422);
        }

        // L'email reste unique en base même pour une ligne supprimée : si un autre
        // rédacteur actif l'a repris entre-temps, la restauration créerait un doublon.
        $doublon = Redacteur::where('email', $redacteur->email)
            ->where('id', '!=', $redacteur->id)
            ->exists();

        if ($doublon) {
            return response()->json([
                'message' => 'Impossible de restaurer ce rédacteur : un autre compte utilise déjà cet email.'
            ], 422);
        }

        $redacteur->restore();

        return response()->json([
            'message' => 'Rédacteur restauré avec succès',
            'data' => new RedacteurResource($redacteur->loadCount('blogs'))
        ]);
    }

    public function forceDelete(int $id)
    {
        $redacteur = Redacteur::withTrashed()->findOrFail($id);

        if ($redacteur->role === 'admin' || $redacteur->est_systeme) {
            return response()->json(['message' => 'Ce compte ne peut pas être supprimé définitivement.'], 403);
        }

        if (! $redacteur->trashed()) {
            return response()->json(['message' => 'Supprimez-le d\'abord (corbeille) avant la suppression définitive.'], 422);
        }

        // Les articles sont normalement déjà réaffectés à La Rédaction lors de la
        // suppression douce ; on vérifie quand même avant de supprimer la ligne.
        if ($redacteur->blogs()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer définitivement ce rédacteur : il est encore lié à des articles.'
            ], 422);
        }

        $redacteur->forceDelete();

        return response()->json(['message' => 'Rédacteur supprimé définitivement']);
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

