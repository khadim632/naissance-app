import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { BirthDeclaration, ApiResponse } from '../types';

export const birthService = {
  getAll: () => api.get<ApiResponse<BirthDeclaration[]>>(API_ENDPOINTS.BIRTH_DECLARATIONS),
  
  getById: (id: string) => api.get<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.BIRTH_DECLARATION(id)),
  
  create: (data: Partial<BirthDeclaration>) => 
    api.post<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.BIRTH_DECLARATIONS, data),
  
  update: (id: string, data: Partial<BirthDeclaration>) =>
    api.put<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.BIRTH_DECLARATION(id), data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(API_ENDPOINTS.BIRTH_DECLARATION(id)),
  
  validate: (id: string, isApproved: boolean, comments?: string) =>
    api.put<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.BIRTH_VALIDATION(id), {
      isApproved,
      comments
    })
};