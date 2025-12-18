<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;

class TagController extends Controller
{

    public function index()
    {
        $tags = Tag::withCount('blogs')->get();
        return TagResource::collection($tags);
    }

    public function store(StoreTagRequest $request)
    {
        $tag = Tag::create($request->validated());
        
        return response()->json([
            'message' => 'Tag créé avec succès',
            'data' => new TagResource($tag)
        ], 201);
    }

    public function show($slug)
    {
        $tag = Tag::where('slug', $slug)
            ->with(['blogs' => function($query) {
                $query->where('statut', 'publie')->orderBy('date_creation', 'desc');
            }])
            ->firstOrFail();
        
        return new TagResource($tag);
    }


    public function update(UpdateTagRequest $request, $id)
    {
        $tag = Tag::findOrFail($id);
        $tag->update($request->validated());
        
        return response()->json([
            'message' => 'Tag mis à jour avec succès',
            'data' => new TagResource($tag)
        ]);
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();
        
        return response()->json([
            'message' => 'Tag supprimé avec succès'
        ]);
    }
}   