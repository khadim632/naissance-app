import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { DeathDeclaration, ApiResponse } from '../types';

export const deathService = {
  getAll: () => api.get<ApiResponse<DeathDeclaration[]>>(API_ENDPOINTS.DEATH_DECLARATIONS),
  
  getById: (id: string) => api.get<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.DEATH_DECLARATION(id)),
  
  create: (data: Partial<DeathDeclaration>) =>
    api.post<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.DEATH_DECLARATIONS, data),
  
  update: (id: string, data: Partial<DeathDeclaration>) =>
    api.put<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.DEATH_DECLARATION(id), data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(API_ENDPOINTS.DEATH_DECLARATION(id)),
  
  validate: (id: string, isApproved: boolean, comments?: string) =>
    api.put<ApiResponse<DeathDeclaration>>(API_ENDPOINTS.DEATH_VALIDATION(id), {
      isApproved,
      comments
    })
};