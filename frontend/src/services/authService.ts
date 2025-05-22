import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/users`;

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organization: string;
  };
}

interface ApiErrorResponse {
  message?: string;
}

const authService = {
  async login(email: string, motDePasse: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/login`, { email, motDePasse });
    const { accessToken, refreshToken, role, id, nom } = response.data;
    
    // Créer l'objet user avec plus de données disponibles
    const user = {
      id: id || '',
      email: email,
      role: role,
      firstName: nom?.split(' ')[0] || '',
      lastName: nom?.split(' ').slice(1).join(' ') || '',
      organization: ''
    };
    
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token: accessToken, refreshToken, user };
  },

  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data.message || 'Un email de réinitialisation a été envoyé.';
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Erreur lors de la demande de réinitialisation');
    }
  },

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/verify-reset-token/${token}`);
      return response.data.valid;
    } catch {
      return false;
    }
  },

  async resetPassword(token: string, motDePasse: string): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        motDePasse
      });
      return response.data.message || 'Mot de passe réinitialisé avec succès';
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Erreur lors de la réinitialisation');
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${API_URL}/logout`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      await axios.get(`${API_URL}/verifier-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch {
      return false;
    }
  },

  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      return accessToken;
    } catch {
      return null;
    }
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};

export default authService;