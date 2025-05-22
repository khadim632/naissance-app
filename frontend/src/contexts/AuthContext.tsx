import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import authService from '../services/authService';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

interface ApiErrorResponse {
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isValid = await authService.verifyToken();
        if (isValid) {
          const userData = authService.getUser();
          if (userData) {
            // Mapper les données du service vers le type User
            const user: User = {
              _id: userData.id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role as UserRole,
              organization: userData.organization,
              createdAt: new Date().toISOString(), // Valeur par défaut
              updatedAt: new Date().toISOString()  // Valeur par défaut
            };
            setAuthState(prev => ({ ...prev, user }));
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authService.login(email, password);
      
      // Mapper les données de la réponse vers le type User
      const user: User = {
        _id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role as UserRole,
        organization: response.user.organization,
        createdAt: new Date().toISOString(), // Valeur par défaut
        updatedAt: new Date().toISOString()  // Valeur par défaut
      };
      
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null
      }));
      
      toast.success('Connexion réussie!');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Erreur de connexion';
      setAuthState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
      toast.error(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      toast.success('Déconnexion réussie');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const value = {
    authState,
    login,
    logout,
    isAuthenticated: !!authState.user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};