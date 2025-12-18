
import apiClient from '../axios';
import { ENDPOINTS } from '../endpoints';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/lib/types/user';

export const authService = {
  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, credentials);
    return data;
  },

  // Inscription
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.REGISTER, userData);
    return data;
  },

  // Récupérer l'utilisateur connecté
  getUser: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>(ENDPOINTS.USER);
    return data.user;
  },

  // Déconnexion
  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.LOGOUT);
  },

  // Mettre à jour le profil
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put<{ user: User }>(ENDPOINTS.UPDATE_PROFILE, userData);
    return data.user;
  },

  // Changer le mot de passe
  changePassword: async (passwords: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> => {
    await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, passwords);
  },
};
