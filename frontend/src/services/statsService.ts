import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { DashboardStats, ApiResponse } from '../types';

export const statsService = {
  getHospitalStats: () => 
    api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.HOSPITAL_STATS),
  
  getMunicipalityStats: () =>
    api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.MUNICIPALITY_STATS),
  
  getGlobalStats: () =>
    api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.GLOBAL_STATS),
  
  getHospitalDetailedStats: () =>
    api.get<ApiResponse<Record<string, DashboardStats>>>(API_ENDPOINTS.HOSPITAL_DETAILED_STATS)
};

