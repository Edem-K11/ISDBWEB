<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\RedacteurController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ImageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DomaineController;
use App\Http\Controllers\Api\MentionController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\AnneeAcademiqueController;
use App\Http\Controllers\Api\OffreFormationController;
use App\Http\Controllers\Api\RadioController;
use App\Http\Controllers\Api\MentionPageContentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes d'authentification (publiques)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Routes publiques - Radio en direct
Route::get('/radio', [RadioController::class, 'show']);

// Récupérer les mentions et leur contenu pour la page /formations
Route::get('/formations', [MentionPageContentController::class, 'indexPublic']);
Route::get('/formations/{mentionSlug}', [MentionPageContentController::class, 'show']);
// Détails d'une offre de formation
Route::get('/formations/{mentionSlug}/{formationSlug}', [MentionPageContentController::class, 'showOffre']);




// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Upload d'images
    Route::post('/images/upload', [ImageController::class, 'upload']);
    Route::post('/images/upload-multiple', [ImageController::class, 'uploadMultiple']);            
    Route::delete('/images/delete', [ImageController::class, 'delete']);

    
    // Routes admin uniquement

    Route::prefix('dashboard')->group(function () {

        Route::get('blogs', [BlogController::class, 'indexDashboard']);
        Route::post('blogs', [BlogController::class, 'store']);
        Route::put('blogs/{id}', [BlogController::class, 'update']);
        Route::delete('blogs/{id}', [BlogController::class, 'destroy']);
        Route::get('blogs/{id}', [BlogController::class, 'showAdmin']);

        Route::middleware('role:admin')->group(function () {
            // Blogs
            Route::patch('blogs/{id}/statut', [BlogController::class, 'updateStatut']);
            
            
            // Redacteurs
            Route::resource('redacteurs', RedacteurController::class);
            
            // Tags
            Route::post('tags', [TagController::class, 'store']);
            Route::put('tags/{id}', [TagController::class, 'update']);
            Route::delete('tags/{id}', [TagController::class, 'destroy']);

            // Domaines
            Route::resource('domaines', DomaineController::class);

            // Mentions
            Route::resource('mentions', MentionController::class);

            // Formations
            Route::resource('formations', FormationController::class);

            // Années académiques
            Route::get('annees-academiques', [AnneeAcademiqueController::class, 'index']);
            Route::post('annees-academiques', [AnneeAcademiqueController::class, 'store']);
            Route::get('annees-academiques/{id}', [AnneeAcademiqueController::class, 'show']);
            Route::put('annees-academiques/{id}', [AnneeAcademiqueController::class, 'update']);
            Route::delete('annees-academiques/{id}', [AnneeAcademiqueController::class, 'destroy']);


            // Offres de formation
            Route::get('offres-formations', [OffreFormationController::class, 'index']);
            Route::post('offres-formations', [OffreFormationController::class, 'store']);
            Route::get('offres-formations/{offreFormation}', [OffreFormationController::class, 'show']);
            Route::put('offres-formations/{offreFormation}', [OffreFormationController::class, 'update']);
            Route::delete('offres-formations/{offreFormation}', [OffreFormationController::class, 'destroy']);
            Route::patch('offres-formations/{offreFormation}/toggle-dispensee', [OffreFormationController::class, 'toggleDispensee']);

            // Radio (une seule)
            Route::put('radio', [RadioController::class, 'update']);
            Route::post('radio/toggle-live', [RadioController::class, 'toggleLive']);

        });
    });

    // Routes pour les redacteurs (peuvent voir/modifier leurs propres blogs)
    Route::prefix('redacteur')->group(function () {
        Route::get('blogs', [BlogController::class, 'myBlogs']); // Mes blogs
        Route::post('blogs', [BlogController::class, 'store']); // Créer
        Route::get('blogs/{id}', [BlogController::class, 'showMyBlog']); // Voir mon blog
        Route::put('blogs/{id}', [BlogController::class, 'updateMyBlog']); // Modifier
        Route::delete('blogs/{id}', [BlogController::class, 'destroyMyBlog']); // Supprimer
    });
});

// Routes publiques
Route::prefix('blogs')->group(function () {
    Route::get('/', [BlogController::class, 'index']);
    Route::get('tags', [TagController::class, 'index']);
    // Route::get('redacteurs', [redacteurController::class, 'index']);
    Route::get('tags/{slug}', [TagController::class, 'show']);
    // Route::get('redacteurs/{id}', [redacteurController::class, 'show']);
    Route::get('/{slug}', [BlogController::class, 'show']);
});