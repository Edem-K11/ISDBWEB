
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { viderCacheDashboard } from '@/lib/cache/dashboardCache';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/authService';
import { User, AuthState, LoginCredentials } from '@/lib/types/user';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAdmin: () => boolean;
  isRedacteur: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Charger l'utilisateur au montage
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      // Session déjà connue sur ce poste : on affiche tout de suite, la vérification
      // auprès du serveur continue en arrière-plan.
      const dejaConnu = localStorage.getItem('user');
      if (dejaConnu) {
        try {
          setUser(JSON.parse(dejaConnu));
          setIsLoading(false);
        } catch {
          // donnée corrompue : on attend la vérification
        }
      }

      const userData = await authService.getUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      viderCacheDashboard();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);

      // Le message de bienvenue du tableau de bord doit réapparaître à chaque
      // connexion, même s'il avait été fermé lors d'une session précédente.
      sessionStorage.removeItem('dashboard_welcome_dismissed');

      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      viderCacheDashboard();
      setUser(null);

      toast.success('Déconnexion réussie');
      router.push('/login');
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profil mis à jour !');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de mise à jour';
      toast.error(message);
      throw error;
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isRedacteur = () => user?.role === 'redacteur';

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    isAdmin,
    isRedacteur,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
