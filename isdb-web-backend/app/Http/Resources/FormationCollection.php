<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FormationCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->collection->count(),
                'principales' => $this->collection->where('type_formation', 'PRINCIPALE')->count(),
                'modulaires' => $this->collection->where('type_formation', 'MODULAIRE')->count(),
                'actives' => $this->collection->where('statut_formation', 'ACTIVE')->count(),
            ],
        ];
    }
}