<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class OffreFormationCollection extends ResourceCollection
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
                'dispensees' => $this->collection->where('est_dispensee', true)->count(),
                'avec_places_limitees' => $this->collection->whereNotNull('place_limited')->count(),
            ],
        ];
    }
}