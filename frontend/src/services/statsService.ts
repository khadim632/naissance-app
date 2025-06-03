import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { 
  HospitalStats, 
  MunicipalityStats, 
  GlobalStats, 
  AdminHospitalStats,
  ValidationGlobalStats 
} from '../types';

export const statsService = {
  // ✅ Statistiques pour hôpital (renvoie HospitalStats)
  getHospitalStats: async () => {
    const response = await api.get<HospitalStats>(API_ENDPOINTS.HOSPITAL_STATS);
    return response;
  },
  
  // ✅ Statistiques pour mairie (renvoie MunicipalityStats)
  getMunicipalityStats: async () => {
    const response = await api.get<MunicipalityStats>(API_ENDPOINTS.MUNICIPALITY_STATS);
    return response;
  },
  
  // ✅ Statistiques globales pour admin (renvoie GlobalStats)
  getGlobalStats: async () => {
    const response = await api.get<GlobalStats>(API_ENDPOINTS.GLOBAL_STATS);
    return response;
  },
  
  // ✅ Statistiques détaillées par hôpital pour admin (renvoie AdminHospitalStats[])
  getHospitalDetailedStats: async () => {
    const response = await api.get<AdminHospitalStats[]>(API_ENDPOINTS.HOSPITAL_DETAILED_STATS);
    return response;
  },

  // ✅ Nouvelles statistiques de validation globales
  getValidationGlobalStats: async () => {
    const response = await api.get<ValidationGlobalStats>(API_ENDPOINTS.VALIDATION_GLOBAL_STATS);
    return response;
  }
};