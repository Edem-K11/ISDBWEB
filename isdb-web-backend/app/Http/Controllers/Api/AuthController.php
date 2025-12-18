<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Redacteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel redacteur
     */
    public function register(RegisterRequest $request)
    {
        $redacteur = Redacteur::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'redacteur', // Par défaut
        ]);

        $token = $redacteur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => [
                'id' => $redacteur->id,
                'nom' => $redacteur->nom,
                'email' => $redacteur->email,
                'avatar' => $redacteur->avatar,
                'role' => $redacteur->role,
            ],
            'token' => $token,
        ], 201);
    }

    /**
     * Connexion
     */
    public function login(LoginRequest $request)
    {
        $redacteur = Redacteur::where('email', $request->email)->first();

        if (!$redacteur || !Hash::check($request->password, $redacteur->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if (!$redacteur->est_actif) {
            return response()->json([
                'message' => 'Votre compte est désactivé. Contactez un administrateur.',
            ], 403);
        }

        // Révoquer les anciens tokens
        $redacteur->tokens()->delete();

        // Créer un nouveau token
        $token = $redacteur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $redacteur->id,
                'nom' => $redacteur->nom,
                'email' => $redacteur->email,
                'avatar' => $redacteur->avatar,
                'role' => $redacteur->role,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Récupérer l'utilisateur connecté
     */
    public function user(Request $request)
    {
        $redacteur = $request->user();

        return response()->json([
            'user' => [
                'id' => $redacteur->id,
                'nom' => $redacteur->nom,
                'email' => $redacteur->email,
                'avatar' => $redacteur->avatar,
                'role' => $redacteur->role,
                'bio' => $redacteur->bio,
            ],
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function updateProfile(Request $request)
    {
        $redacteur = $request->user();

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:redacteurs,email,' . $redacteur->id,
            'avatar' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        $redacteur->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => [
                'id' => $redacteur->id,
                'nom' => $redacteur->nom,
                'email' => $redacteur->email,
                'avatar' => $redacteur->avatar,
                'role' => $redacteur->role,
                'bio' => $redacteur->bio,
            ],
        ]);
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $redacteur = $request->user();

        if (!Hash::check($validated['current_password'], $redacteur->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $redacteur->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // Révoquer tous les tokens sauf le token actuel
        $redacteur->tokens()->where('id', '!=', $redacteur->currentAccessToken()->id)->delete();

        return response()->json([
            'message' => 'Mot de passe modifié avec succès',
        ]);
    }
}
