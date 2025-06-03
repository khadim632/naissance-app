// User related types
export enum UserRole {
  hopital = 'hopital',
  mairie = 'mairie',
  admin = 'admin',
  superadmin = 'superadmin'
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// Declaration statuses
export enum DeclarationStatus {
  en_attente = 'en attente',
  validée = 'validée',
  refusée = 'refusée'
}

// Birth declaration types
export interface Parent {
  firstName: string;
  lastName: string;
  idNumber: string;
  phoneNumber: string;
  address: string;
  email?: string;
}

export interface BirthDeclaration {
  _id: string;
  childFirstName: string;
  childLastName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: 'male' | 'female';
  father: Parent;
  mother: Parent;
  declarationDate: string;
  status: DeclarationStatus;
  hospitalId: string;
  hospitalName: string;
  municipalityId: string;
  municipalityName: string;
  comments?: string;
  validationDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Death declaration types
export interface Deceased {
  firstName: string;
  lastName: string;
  birthDate: string;
  idNumber: string;
  address: string;
}

export interface DeathDeclaration {
  _id: string;
  deceased: Deceased;
  deathDate: string;
  deathTime: string;
  deathPlace: string;
  deathCause: string;
  declarationDate: string;
  status: DeclarationStatus;
  hospitalId: string;
  hospitalName: string;
  municipalityId: string;
  municipalityName: string;
  comments?: string;
  validationDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ NOUVELLES INTERFACES CORRESPONDANT AU BACKEND
export interface HospitalStats {
  hopital: string;
  nbNaissances: number;
  nbDeces: number;
  total: number;
}

export interface MunicipalityStats {
  mairie: string;
  statistiques: {
    total: number;
    enAttente: number;
    validees: number;
    refusees: number;
  };
}

export interface GlobalStats {
  totalNaissances: number;
  totalDeces: number;
  total: number;
}

export interface ValidationGlobalStats {
  total: number;
  enAttente: number;
  validees: number;
  refusees: number;
}

export interface AdminHospitalStats {
  hopital: string;
  totalNaissances: number;
  totalDeces: number;
}

// Statistics types (conservées pour compatibilité)
export interface DashboardStats {
  totalBirthDeclarations: number;
  totalDeathDeclarations: number;
  pendingBirthDeclarations: number;
  pendingDeathDeclarations: number;
  validatedBirthDeclarations: number;
  validatedDeathDeclarations: number;
  rejectedBirthDeclarations: number;
  rejectedDeathDeclarations: number;
}

// API Response types
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}