
export type UserRole = 'admin' | 'redacteur';

export interface User {
  id: number;
  nom: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  email: string;
  password: string;
  password_confirmation: string;
}
