<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FormationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titre' => $this->titre,
            'slug' => $this->slug,
            'type_formation' => $this->type_formation,
            'numero_module' => $this->numero_module,
            'description' => $this->description,
            'contenu' => $this->contenu,
            'mention_id' => $this->mention_id,
            'diplome' => $this->diplome,
            
            // Informations pédagogiques
            'condition_admission' => $this->condition_admission,
            'profile_intree' => $this->profile_intree,
            'specialite' => $this->specialite,
            'objectifs' => $this->objectifs,
            'objectif_general' => $this->objectif_general,
            'objectif_specifique' => $this->objectif_specifique,
            'competences_visees' => $this->competences_visees,
            'debouches' => $this->debouches,
            'profile_sortie' => $this->profile_sortie,
            'evaluation' => $this->evaluation,
            'programme' => $this->programme,
            // Le champ stocke un chemin relatif (ex: "programmes/xxx.pdf") lors de
            // l'upload direct dans FormationController — on le convertit en URL
            // absolue ici pour que le lien fonctionne côté client.
            'programme_pdf' => $this->programme_pdf
                ? (str_starts_with($this->programme_pdf, 'http')
                    ? $this->programme_pdf
                    : asset('storage/' . $this->programme_pdf))
                : null,
            'programme_image' => $this->programme_image,
            
            // Informations pratiques
            'duree_formation' => $this->duree_formation,
            'duree_heures' => $this->duree_heures,
            'frais_scolarite' => $this->frais_scolarite,
            'statut_formation' => $this->statut_formation,
            
            // Accessors
            'est_principale' => $this->est_principale,
            'est_modulaire' => $this->est_modulaire,
            'est_active' => $this->est_active,
            
            // Relations conditionnelles
            'mention' => new MentionResource($this->whenLoaded('mention')),
            'domaine' => $this->when(
                $this->relationLoaded('mention') && $this->mention?->relationLoaded('domaine'),
                function () {
                    return new DomaineResource($this->mention->domaine);
                }
            ),
            'offresFormations' => OffreFormationResource::collection($this->whenLoaded('offresFormations')),
            'offreActuelle' => new OffreFormationResource($this->whenLoaded('offreActuelle')),
            
            // Métadonnées
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}