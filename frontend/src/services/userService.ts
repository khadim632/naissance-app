import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/users`;

export interface CreateUserData {
  nom: string;
  email: string;
  motDePasse: string;
  role: 'hopital' | 'mairie' | 'admin' | 'superadmin';
}

export interface UserResponse {
  _id: string;
  nom: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiErrorResponse {
  message?: string;
}

// Interface pour la réponse du backend
interface GetUsersResponse {
  data: UserResponse[];
}

const userService = {
  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await axios.get<GetUsersResponse>(API_URL, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      // Vérifier si la réponse contient des données
      if (!response.data || !response.data.data) {
        throw new Error('Aucune donnée reçue');
      }

      // Retourner le tableau d'utilisateurs qui est dans response.data.data
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      // Gestion spécifique des erreurs d'autorisation
      if (axiosError.response?.status === 403) {
        throw new Error('Accès refusé - Droits insuffisants');
      }
      
      if (axiosError.response?.status === 401) {
        throw new Error('Session expirée - Veuillez vous reconnecter');
      }
      throw new Error(
        axiosError.response?.data?.message || 'Erreur lors de la récupération des utilisateurs'
      );
    }
  },

  async createUser(userData: CreateUserData): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await axios.post(API_URL + '/register', userData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.status === 403) {
        throw new Error('Vous n\'avez pas les droits pour créer ce type d\'utilisateur');
      }

      throw new Error(
        axiosError.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
      );
    }
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.status === 403) {
        throw new Error('Vous n\'avez pas les droits pour supprimer cet utilisateur');
      }
      throw new Error(
        axiosError.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur'
      );
    }
  },

  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await axios.put(`${API_URL}/${userId}`, userData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.status === 403) {
        throw new Error('Vous n\'avez pas les droits pour modifier cet utilisateur');
      }
      
      throw new Error(
        axiosError.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      );
    }
  }
};

export default userService;