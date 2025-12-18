<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::with(['redacteur', 'tags'])
            ->publie()
            ->orderBy('date_creation', 'desc');

        // Filtrage par tag
        if ($request->filled('tag')) {
            $query->withTag($request->tag);
        }

        // Filtrage par redacteur
        if ($request->filled('redacteur_id')) {
            $query->where('redacteur_id', $request->redacteur_id);
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('resume', 'like', "%{$search}%");
            });
        }

        $blogs = $query->paginate(10);
        
        return BlogResource::collection($blogs);
    }


    public function store(StoreBlogRequest $request)
    {
        $blog = Blog::create($request->except('tags'));
        
        // Attacher les tags
        $blog->tags()->attach($request->tags);
        
        $blog->load(['redacteur', 'tags']);
        
        return response()->json([
            'message' => 'Blog créé avec succès',
            'data' => new BlogResource($blog)
        ], 201);
    }

    public function show($slug)
    {
        $blog = Blog::with(['redacteur', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();
        
        if ($blog->statut !== 'publie') {
            return response()->json([
                'message' => 'Blog non disponible'
            ], 403);
        }
        
        return new BlogResource($blog);
    }

    public function indexDashboard(Request $request)
    {
        $query = Blog::with(['redacteur', 'tags'])
            ->orderBy('date_creation', 'desc');

        // Filtrage par statut
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtrage par tag
        if ($request->filled('tag')) {
            $query->withTag($request->tag);
        }

        // Filtrage par redacteur
        if ($request->filled('redacteur_id')) {
            $query->where('redacteur_id', $request->redacteur_id);
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('resume', 'like', "%{$search}%");
            });
        }

        $blogs = $query->paginate(10);
        
        return BlogResource::collection($blogs);
    }

    public function showAdmin($id)
    {
        $blog = Blog::with(['redacteur', 'tags'])->findOrFail($id);
        return new BlogResource($blog);
    }

    public function update(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::findOrFail($id);
        $blog->update($request->except('tags'));
        
        // Mettre à jour les tags
        if ($request->has('tags')) {
            $blog->tags()->sync($request->tags);
        }
        
        $blog->load(['redacteur', 'tags']);
        
        return response()->json([
            'message' => 'Blog mis à jour avec succès',
            'data' => new BlogResource($blog)
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();
        
        return response()->json([
            'message' => 'Blog supprimé avec succès'
        ]);
    }

    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:brouillon,publie'
        ]);

        $blog = Blog::findOrFail($id);
        $blog->update(['statut' => $request->statut]);
        
        $blog->load(['redacteur', 'tags']);
        
        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'data' => new BlogResource($blog)
        ]);
    }

    /**
     * Récupérer les blogs de le redacteur connecté
     */
    public function myBlogs(Request $request)
    {
        $query = Blog::with(['redacteur', 'tags'])
            ->where('redacteur_id', $request->user()->id)
            ->orderBy('date_creation', 'desc');

        // Filtrage par statut
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('resume', 'like', "%{$search}%");
            });
        }

        $blogs = $query->paginate(20);
            
        return BlogResource::collection($blogs);
    }

    /**
     * Voir un de mes blogs
     */
    public function showMyBlog(Request $request, $id)
    {
        $blog = Blog::with(['redacteur', 'tags'])
            ->where('id', $id)
            ->where('redacteur_id', $request->user()->id)
            ->firstOrFail();
        
        return new BlogResource($blog);
    }

    /**
     * Mettre à jour un de mes blogs
     */
    public function updateMyBlog(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::where('id', $id)
            ->where('redacteur_id', $request->user()->id)
            ->firstOrFail();
        
        $blog->update($request->except('tags'));
        
        if ($request->has('tags')) {
            $blog->tags()->sync($request->tags);
        }
        
        $blog->load(['redacteur', 'tags']);
        
        return response()->json([
            'message' => 'Blog mis à jour avec succès',
            'data' => new BlogResource($blog)
        ]);
    }

    /**
     * Supprimer un de mes blogs
     */
    public function destroyMyBlog(Request $request, $id)
    {
        $blog = Blog::where('id', $id)
            ->where('redacteur_id', $request->user()->id)
            ->firstOrFail();
        
        $blog->delete();
        
        return response()->json([
            'message' => 'Blog supprimé avec succès'
        ]);
    }

}