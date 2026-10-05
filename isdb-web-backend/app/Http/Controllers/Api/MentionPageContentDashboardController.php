<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mention;
use App\Models\MentionPageContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Édition du contenu public d'une filière depuis le dashboard.
class MentionPageContentDashboardController extends Controller
{
    private const THEMES = ['green', 'orange', 'red', 'gold'];

    private const CHAMPS_TEXTE = ['hero_title', 'hero_subtitle', 'hero_description', 'section_title', 'section_description', 'cta_title', 'cta_description', 'seo_title', 'seo_description'];

    public function show(Mention $mention): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->formater($mention),
        ]);
    }

    public function update(Request $request, Mention $mention): JsonResponse
    {
        $donnees = $request->validate([
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string', 'max:1000'],
            'section_title' => ['nullable', 'string', 'max:255'],
            'section_description' => ['nullable', 'string', 'max:1000'],
            'cta_title' => ['nullable', 'string', 'max:255'],
            'cta_description' => ['nullable', 'string', 'max:1000'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'array', 'max:20'],
            'seo_keywords.*' => ['string', 'max:50'],
            'theme' => ['required', 'in:'.implode(',', self::THEMES)],
        ]);

        // Les colonnes texte sont NOT NULL en base : un champ vide est stocké vide,
        // et le site affiche alors son texte par défaut (les tests sont sur des chaînes vides).
        $contenu = MentionPageContent::firstOrNew(['mention_id' => $mention->id]);
        if (! $contenu->exists) {
            foreach (self::CHAMPS_TEXTE as $champ) {
                $contenu->{$champ} = '';
            }
            $contenu->seo_keywords = [];
        }

        foreach ($donnees as $cle => $valeur) {
            $contenu->{$cle} = $valeur ?? ($cle === 'seo_keywords' ? [] : '');
        }

        $contenu->save();

        return response()->json([
            'success' => true,
            'message' => 'Page publique enregistrée.',
            'data' => $this->formater($mention->fresh()),
        ]);
    }

    private function formater(Mention $mention): array
    {
        $contenu = $mention->mentionPageContent;

        return [
            'hero_title' => $contenu?->hero_title,
            'hero_subtitle' => $contenu?->hero_subtitle,
            'hero_description' => $contenu?->hero_description,
            'section_title' => $contenu?->section_title,
            'section_description' => $contenu?->section_description,
            'cta_title' => $contenu?->cta_title,
            'cta_description' => $contenu?->cta_description,
            'seo_title' => $contenu?->seo_title,
            'seo_description' => $contenu?->seo_description,
            'seo_keywords' => $contenu?->seo_keywords ?? [],
            'theme' => $contenu?->theme ?? $mention->themeParDefaut(),
        ];
    }
}
