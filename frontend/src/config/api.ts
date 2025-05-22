export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  REFRESH_TOKEN: '/users/refresh-token',
  FORGOT_PASSWORD: '/users/forgot-password',
  RESET_PASSWORD: '/users/reset-password',

  // Pré-déclarations de naissance
  BIRTH_DECLARATIONS: '/predeclarations/naissance',
  BIRTH_DECLARATION: (id: string) => `/predeclarations/naissance/${id}`,
  BIRTH_VALIDATION: (id: string) => `/predeclarations/naissance/${id}/validation`,

  // Pré-déclarations de décès
  DEATH_DECLARATIONS: '/predeclarations/deces',
  DEATH_DECLARATION: (id: string) => `/predeclarations/deces/${id}`,
  DEATH_VALIDATION: (id: string) => `/predeclarations/deces/${id}/validation`,

  // Statistiques
  HOSPITAL_STATS: '/predeclarations/stats/hopital',
  MUNICIPALITY_STATS: '/predeclarations/stats/mairie',
  GLOBAL_STATS: '/predeclarations/stats/globales',
  HOSPITAL_DETAILED_STATS: '/predeclarations/stats/par-hopital',
};