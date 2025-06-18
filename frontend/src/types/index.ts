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

// types.ts

// Parent type (utilisé pour père et mère)
export interface Parent {
  nom: string; // lastName
  prenom: string; // firstName
  telephone: string; // phoneNumber
  email?: string;
  carteIdentite: string; // idNumber
}

// Birth declaration type (aligned with PreDeclarationNaissance)
export interface BirthDeclaration {
  _id: string;
  nomBebe: string; // childLastName
  prenomBebe: string; // childFirstName
  dateNaissance: string; // birthDate
  heureNaissance: string; // birthTime
  lieuNaissance: string; // birthPlace
  sexe: 'masculin' | 'féminin'; // gender
  pere: Parent; // father
  mere: Parent; // mother
  mairieDestinataire: {
    _id: string;
    nom: string;
    email: string;
  }; // municipality
  statutValidation: DeclarationStatus; // status
  commentaireValidation?: string; // comments
  dateValidation?: string; // validationDate
  hopitalNom: string; // hospitalName
  hopitalEmail: string; // hospitalEmail
  createdBy: {
    _id: string;
    nom: string;
    email: string;
    role: UserRole;
  }; // hospital user
  createdAt: string;
  updatedAt: string;
}

// Death declaration type (aligned with PreDeclarationDeces)
export interface DeathDeclaration {
  _id: string;
  pere?: Parent; // father (optional in schema)
  mere?: Parent; // mother (optional in schema)
  descriptionMort: string; // deathCause
  hopitalNom: string; // hospitalName
  hopitalEmail: string; // hospitalEmail
  createdBy: {
    _id: string;
    nom: string;
    email: string;
    role: UserRole;
  }; // hospital user
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