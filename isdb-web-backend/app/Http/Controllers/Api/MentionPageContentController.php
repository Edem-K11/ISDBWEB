<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mention;
use Illuminate\Http\JsonResponse;
use App\Models\AnneeAcademique;
use App\Models\Formation;
use App\Models\OffreFormation;


class MentionPageContentController extends Controller
{
    /**
     * Liste toutes les mentions pour la page /formations
     */
    public function index(): JsonResponse
    {
        $mentions = Mention::with(['domaine', 'mentionPageContent'])
            ->withActiveFormations()
            ->orderBy('titre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $mentions->map(function ($mention) {
                return [
                    'id' => $mention->id,
                    'titre' => $mention->titre,
                    'slug' => $mention->slug,
                    'description' => $mention->description,
                    'domaine' => [
                        'id' => $mention->domaine->id,
                        'nom' => $mention->domaine->nom,
                    ],
                    'formations_count' => $mention->formations()->where('statut', 'ACTIVE')->count(),
                    'has_content' => $mention->mentionPageContent !== null,
                ];
            }),
        ]);
    }

    public function indexPublic(): JsonResponse
    {
        $mentions = Mention::orderBy('titre')->get();

        return response()->json([
            'success' => true,
            'data' => $mentions->map(function ($mention) {
                return [
                    'id' => $mention->id,
                    'titre' => $mention->titre,
                    'slug' => $mention->slug,
                    'description' => $mention->description,
                ];
            }),
        ]);
    }

    /**
     * Récupère une mention par slug avec son contenu et ses formations
     */
    public function show(string $mentionSlug): JsonResponse
    {
        // Récupérer l'année académique actuelle
        $anneeActuelle = AnneeAcademique::where('est_actuelle', true)->first();

        $mention = Mention::where('slug', $mentionSlug)
            ->with([
                'domaine',
                'mentionPageContent',
                // Formations ACTIVES de cette mention
                'formations' => function ($query) {
                    $query->where('statut_formation', 'ACTIVE')
                        ->with(['offresFormations' => function ($q) {
                            // Offres DISPENSÉES de l'année ACTUELLE
                            $q->where('est_dispensee', true)
                                ->anneeActuelle()
                                ->with('anneeAcademique');
                        }])
                        ->orderByRaw("FIELD(type_formation, 'PRINCIPALE', 'MODULAIRE')")
                        ->orderBy('titre');
                }
            ])
            ->firstOrFail();

        // Autres mentions du même domaine (max 3)
        $relatedMentions = Mention::where('domaine_id', $mention->domaine_id)
            ->where('id', '!=', $mention->id)
            ->avecFormationsActives()
            ->limit(3)
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'titre' => $m->titre,
                    'slug' => $m->slug,
                    'theme' => $m->mentionPageContent->theme ?? 'green',
                ];
            });

        $content = $mention->mentionPageContent;

        return response()->json([
            'success' => true,
            'data' => [
                // Infos de base
                'mention' => [
                    'id' => $mention->id,
                    'titre' => $mention->titre,
                    'slug' => $mention->slug,
                    'description' => $mention->description,
                    'domaine' => [
                        'id' => $mention->domaine->id,
                        'nom' => $mention->domaine->nom,
                        'slug' => $mention->domaine->slug ?? strtolower(str_replace(' ', '-', $mention->domaine->nom)),
                    ],
                ],
                
                // Contenu éditorial (peut être null)
                'content' => $content ? [
                    'hero' => [
                        'title' => $content->hero_title,
                        'subtitle' => $content->hero_subtitle,
                        'description' => $content->hero_description,
                    ],
                    'section' => [
                        'title' => $content->section_title,
                        'description' => $content->section_description,
                    ],
                    'cta' => [
                        'title' => $content->cta_title,
                        'description' => $content->cta_description,
                    ],
                    'seo' => [
                        'title' => $content->seo_title,
                        'description' => $content->seo_description,
                        'keywords' => $content->seo_keywords,
                    ],
                    'theme' => $content->theme,
                ] : null,
                
                // Offres de formation DISPENSÉES pour l'année ACTUELLE
                'offres' => $mention->formations->flatMap(function ($formation) use ($anneeActuelle) {
                    // Filtrer uniquement les offres de l'année actuelle
                    $offresActuelles = $formation->offresFormations->filter(function ($offre) use ($anneeActuelle) {
                        return $offre->anneeAcademique && $offre->anneeAcademique->est_actuelle;
                    });

                    return $offresActuelles->map(function ($offre) use ($formation) {
                        return [
                            'id' => $offre->id,
                            'formation' => [
                                'id' => $formation->id,
                                'titre' => $formation->titre,
                                'slug' => $formation->slug ?? strtolower(str_replace(' ', '-', $formation->titre)),
                                'description' => $formation->description,
                                'type' => $formation->type_formation,
                                'diplome' => $formation->diplome,
                                'duree_formation' => $formation->duree_formation,
                                'niveau_entree' => $formation->profile_intree,
                                'niveau_sortie' => $formation->profile_sortie,
                                'credits_ects' => $this->extractCreditsECTS($formation),
                            ],
                            'offre' => [
                                'chef_parcours' => $offre->chef_parcours,
                                'animateur' => $offre->animateur,
                                'date_debut' => $offre->date_debut ? $offre->date_debut->toDateString() : null,
                                'date_fin' => $offre->date_fin ? $offre->date_fin->toDateString() : null,
                                'place_limited' => $offre->place_limited,
                                'prix' => $offre->prix,
                                'est_dispensee' => $offre->est_dispensee,
                            ],
                            'annee_academique' => $offre->anneeAcademique ? [
                                'id' => $offre->anneeAcademique->id,
                                'libelle' => $offre->anneeAcademique->libelle,
                                'est_actuelle' => $offre->anneeAcademique->est_actuelle,
                            ] : null,
                        ];
                    });
                })->values(),
                
                // Suggestions (autres mentions du domaine)
                'related_mentions' => $relatedMentions,
            ],
        ]);
    }

    /**
     * Récupère les détails complets d'une offre de formation
     * 
     * @param string $mentionSlug - slug de la mention
     * @param string $formationSlug - slug de la formation
     */

    public function showOffre(string $mentionSlug, string $formationSlug): JsonResponse
    {
        // Récupérer la mention
        $mention = Mention::where('slug', $mentionSlug)
            ->with(['domaine', 'mentionPageContent'])
            ->firstOrFail();

        // Récupérer la formation
        $formation = Formation::where('slug', $formationSlug)
            ->where('mention_id', $mention->id)
            ->where('statut_formation', 'ACTIVE')
            ->with(['mention.domaine'])
            ->firstOrFail();

        // Récupérer l'offre de l'année actuelle
        $anneeActuelle = AnneeAcademique::where('est_actuelle', true)->first();
        
        $offre = OffreFormation::where('formation_id', $formation->id)
            ->where('est_dispensee', true)
            ->whereHas('anneeAcademique', function ($q) {
                $q->where('est_actuelle', true);
            })
            ->with('anneeAcademique')
            ->first();

        // Si pas d'offre actuelle, retourner 404
        if (!$offre) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune offre disponible pour cette formation cette année.'
            ], 404);
        }

        // Autres formations de la même mention (suggestions)
        $autresFormations = Formation::where('mention_id', $mention->id)
            ->where('id', '!=', $formation->id)
            ->where('statut_formation', 'ACTIVE')
            ->whereHas('offresFormations', function ($q) {
                $q->where('est_dispensee', true)->anneeActuelle();
            })
            ->limit(3)
            ->get()
            ->map(function ($f) use ($mention) {
                return [
                    'id' => $f->id,
                    'titre' => $f->titre,
                    'slug' => $f->slug ?? strtolower(str_replace(' ', '-', $f->titre)),
                    'type' => $f->type_formation,
                    'mention_slug' => $mention->slug,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                // Mention
                'mention' => [
                    'id' => $mention->id,
                    'titre' => $mention->titre,
                    'slug' => $mention->slug,
                    'domaine' => [
                        'id' => $mention->domaine->id,
                        'nom' => $mention->domaine->nom,
                    ],
                    'theme' => $mention->mentionPageContent->theme ?? 'green',
                ],

                // Formation complète
                'formation' => [
                    'id' => $formation->id,
                    'titre' => $formation->titre,
                    'slug' => $formation->slug ?? strtolower(str_replace(' ', '-', $formation->titre)),
                    'type' => $formation->type_formation,
                    'description' => $formation->description,
                    'diplome' => $formation->diplome,
                    'duree_formation' => $formation->duree_formation,
                    
                    // Profils
                    'profile_intree' => $formation->profile_intree,
                    'profile_sortie' => $formation->profile_sortie,
                    
                    // Pédagogie
                    'condition_admission' => $formation->condition_admission,
                    'objectifs' => $formation->objectifs,
                    'programme' => $formation->programme,
                    'programme_pdf' => $formation->programme_pdf ? url('storage/' . $formation->programme_pdf) : null,
                    'evaluation' => $formation->evaluation,
                    
                    // Autres
                    'specialite' => $formation->specialite,
                    'frais_scolarite' => $formation->frais_scolarite,
                ],

                // Offre actuelle
                'offre' => [
                    'id' => $offre->id,
                    'chef_parcours' => $offre->chef_parcours,
                    'animateur' => $offre->animateur,
                    'date_debut' => $offre->date_debut ? $offre->date_debut->toDateString() : null,
                    'date_fin' => $offre->date_fin ? $offre->date_fin->toDateString() : null,
                    'place_limited' => $offre->place_limited,
                    'prix' => $offre->prix,
                    'annee_academique' => [
                        'id' => $offre->anneeAcademique->id,
                        'libelle' => $offre->anneeAcademique->libelle,
                    ],
                ],

                // Suggestions
                'autres_formations' => $autresFormations,
            ],
        ]);
    }

    /**
     * Extraire les crédits ECTS depuis la description ou autre champ
     */
    private function extractCreditsECTS($formation): ?int
    {
        // Logique d'extraction si stocké ailleurs
        // Sinon retourner une valeur par défaut selon le diplôme
        return match($formation->diplome) {
            'LICENCE_PROFESSIONNELLE', 'LICENCE_FONDAMENTALE' => 180,
            'MASTER' => 120,
            'CERTIFICAT_MODULE' => 60,
            default => null,
        };
    }
}