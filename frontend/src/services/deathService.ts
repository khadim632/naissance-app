import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { DeathDeclaration, ApiResponse } from '../types';

export const deathService = {
  // Récupérer toutes les pré-déclarations de décès
  getAll: () => api.get<ApiResponse<DeathDeclaration[]>>(API_ENDPOINTS.PRE_DECLARATIONS_DEATHS),

  // Récupérer une pré-déclaration par ID
  getById: (id: string) => api.get<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.DEATH_DECLARATION(id)),

  // Créer une nouvelle pré-déclaration
  create: (data: Partial<DeathDeclaration>) =>
    api.post<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.PRE_DECLARATIONS_DEATHS, {
      pere: data.pere,
      mere: data.mere,
      descriptionMort: data.descriptionMort,
    }),

  // Mettre à jour une pré-déclaration
  update: (id: string, data: Partial<DeathDeclaration>) =>
    api.put<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.DEATH_DECLARATION(id), data),

  // Supprimer une pré-déclaration
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(API_ENDPOINTS.DEATH_DECLARATION(id)),

  // Pas de validation pour décès dans le backend actuel
};