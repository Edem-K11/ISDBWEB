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
use App\Http\Controllers\Api\FormationModulaireController;
use App\Http\Controllers\Api\StudioController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\InstitutSettingController;
use App\Http\Controllers\Api\ContactMessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes d'authentification (publiques)
Route::post('/login', [AuthController::class, 'login']);


// Routes publiques - Radio en direct
Route::get('/radio', [RadioController::class, 'show']);

// Page d'accueil (CMS)
Route::get('/homepage', [HomepageController::class, 'show']);

// Informations de l'institut (contacts, réseaux sociaux)
Route::get('/institut', [InstitutSettingController::class, 'show']);

// Formulaire de contact (public)
Route::post('/contact', [ContactMessageController::class, 'store']);

// Formations modulaires (parcours séparé, sans domaine/mention)
Route::get('/formations-modulaires', [FormationModulaireController::class, 'index']);
Route::get('/formations-modulaires/{slug}', [FormationModulaireController::class, 'show']);

// Studios de l'institut
Route::get('/studios', [StudioController::class, 'indexPublic']);
Route::get('/studios/{slug}', [StudioController::class, 'showPublic']);

// Formations principales (domaine → mention → formation)
Route::get('/formations', [MentionPageContentController::class, 'indexPublic']);
Route::get('/formations/{mentionSlug}', [MentionPageContentController::class, 'show']);
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
            // ⚠️ "trashed" est une route littérale : elle doit être déclarée
            // AVANT Route::resource (qui enregistre "domaines/{domaine}" pour
            // show()), sinon Laravel la matcherait comme un {domaine}.
            Route::get('domaines/trashed', [DomaineController::class, 'trashed']);
            Route::resource('domaines', DomaineController::class);
            Route::get('domaines/{domaine}/mentions', [DomaineController::class, 'mentions']);
            Route::get('domaines/{domaine}/formations', [DomaineController::class, 'formations']);
            Route::get('domaines/{domaine}/statistics', [DomaineController::class, 'statistics']);
            Route::patch('domaines/{id}/restore', [DomaineController::class, 'restore']);
            Route::delete('domaines/{id}/force', [DomaineController::class, 'forceDelete']);

            // Mentions
            // ⚠️ même piège d'ordre de route que pour domaines/trashed.
            Route::get('mentions/trashed', [MentionController::class, 'trashed']);
            Route::resource('mentions', MentionController::class);
            Route::get('mentions/{mention}/formations', [MentionController::class, 'formations']);
            Route::get('mentions/{mention}/statistics', [MentionController::class, 'statistics']);
            Route::patch('mentions/{id}/restore', [MentionController::class, 'restore']);
            Route::delete('mentions/{id}/force', [MentionController::class, 'forceDelete']);

            // Formations
            // ⚠️ même piège d'ordre de route que pour domaines/trashed.
            Route::get('formations/trashed', [FormationController::class, 'trashed']);
            Route::resource('formations', FormationController::class);
            Route::patch('formations/{formation}/archive', [FormationController::class, 'archive']);
            Route::patch('formations/{formation}/activate', [FormationController::class, 'activate']);
            Route::patch('formations/{id}/restore', [FormationController::class, 'restore']);
            Route::delete('formations/{id}/force', [FormationController::class, 'forceDelete']);

            // Formations modulaires (table séparée formation_modulaires)
            // ⚠️ "trashed" doit être déclaré AVANT "{formationModulaire}".
            Route::get('formations-modulaires/trashed', [FormationModulaireController::class, 'trashed']);
            Route::get('formations-modulaires', [FormationModulaireController::class, 'indexDashboard']);
            Route::post('formations-modulaires', [FormationModulaireController::class, 'store']);
            Route::get('formations-modulaires/{formationModulaire}', [FormationModulaireController::class, 'showAdmin']);
            Route::put('formations-modulaires/{formationModulaire}', [FormationModulaireController::class, 'update']);
            Route::delete('formations-modulaires/{formationModulaire}', [FormationModulaireController::class, 'destroy']);
            Route::patch('formations-modulaires/{formationModulaire}/archive', [FormationModulaireController::class, 'archive']);
            Route::patch('formations-modulaires/{formationModulaire}/activate', [FormationModulaireController::class, 'activate']);
            Route::patch('formations-modulaires/{id}/restore', [FormationModulaireController::class, 'restore']);
            Route::delete('formations-modulaires/{id}/force', [FormationModulaireController::class, 'forceDelete']);

            // Années académiques
            // ⚠️ La route littérale "actuelle" doit être déclarée AVANT
            // "{id}" : sinon Laravel matche "actuelle" comme un {id} et
            // route vers show(), qui échoue avec un ModelNotFoundException.
            Route::get('annees-academiques/actuelle', [AnneeAcademiqueController::class, 'actuelle']);
            Route::get('annees-academiques', [AnneeAcademiqueController::class, 'index']);
            Route::post('annees-academiques', [AnneeAcademiqueController::class, 'store']);
            Route::get('annees-academiques/{id}', [AnneeAcademiqueController::class, 'show']);
            Route::put('annees-academiques/{id}', [AnneeAcademiqueController::class, 'update']);
            Route::delete('annees-academiques/{id}', [AnneeAcademiqueController::class, 'destroy']);
            Route::get('annees-academiques/{anneeAcademique}/offres', [AnneeAcademiqueController::class, 'offres']);
            Route::get('annees-academiques/{anneeAcademique}/statistics', [AnneeAcademiqueController::class, 'statistics']);
            Route::post('annees-academiques/{anneeSource}/reconduire-offres', [AnneeAcademiqueController::class, 'reconduireOffres']);
            Route::patch('annees-academiques/{id}/restore', [AnneeAcademiqueController::class, 'restore']);
            Route::delete('annees-academiques/{id}/force', [AnneeAcademiqueController::class, 'forceDelete']);


            // Offres de formation
            // ⚠️ Les routes littérales "actuelles" et "trashed" doivent être
            // déclarées AVANT "{offreFormation}" : sinon Laravel les matche
            // comme un {offreFormation} et route vers show(), qui échoue avec
            // un ModelNotFoundException (même piège que pour "actuelle" plus haut).
            Route::get('offres-formations/actuelles', [OffreFormationController::class, 'actuelles']);
            Route::get('offres-formations/trashed', [OffreFormationController::class, 'trashed']);
            Route::get('offres-formations', [OffreFormationController::class, 'index']);
            Route::post('offres-formations', [OffreFormationController::class, 'store']);
            Route::get('offres-formations/{offreFormation}', [OffreFormationController::class, 'show']);
            Route::put('offres-formations/{offreFormation}', [OffreFormationController::class, 'update']);
            Route::delete('offres-formations/{offreFormation}', [OffreFormationController::class, 'destroy']);
            Route::patch('offres-formations/{offreFormation}/toggle-dispensee', [OffreFormationController::class, 'toggleDispensee']);
            Route::get('offres-formations/{offreFormation}/statistics', [OffreFormationController::class, 'statistics']);
            Route::post('offres-formations/{offreFormation}/duplicate', [OffreFormationController::class, 'duplicate']);
            Route::patch('offres-formations/{id}/restore', [OffreFormationController::class, 'restore']);
            Route::delete('offres-formations/{id}/force', [OffreFormationController::class, 'forceDelete']);

            // Radio (une seule)
            Route::put('radio', [RadioController::class, 'update']);
            Route::post('radio/toggle-live', [RadioController::class, 'toggleLive']);

            // Page d'accueil (CMS)
            Route::put('homepage', [HomepageController::class, 'update']);

            // Informations de l'institut
            Route::put('institut', [InstitutSettingController::class, 'update']);

            // Studios
            Route::resource('studios', StudioController::class)->except(['create', 'edit']);

            // Messages de contact
            Route::get('messages', [ContactMessageController::class, 'index']);
            Route::get('messages/{message}', [ContactMessageController::class, 'show']);
            Route::delete('messages/{message}', [ContactMessageController::class, 'destroy']);

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