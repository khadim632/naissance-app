import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { BirthDeclaration, ApiResponse } from '../types';

export const birthService = {
  // Récupérer toutes les pré-déclarations de naissance
  getAll: () => api.get<ApiResponse<BirthDeclaration[]>>(API_ENDPOINTS.PRE_DECLARATIONS_BIRTHS),

  // Récupérer une pré-déclaration par ID
  getById: (id: string) => api.get<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.BIRTH_DECLARATION(id)),

  // Créer une nouvelle pré-déclaration
  create: (data: Partial<BirthDeclaration>) => {
    // Validation des champs obligatoires
    if (!data.dateNaissance || !data.lieuNaissance || !data.heureNaissance) {
      throw new Error('Les champs dateNaissance, lieuNaissance et heureNaissance sont obligatoires.');
    }
    if (!['masculin', 'féminin'].includes(data.sexe || '')) {
      throw new Error('Le sexe doit être "masculin" ou "féminin".');
    }

    return api.post<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.PRE_DECLARATIONS_BIRTHS, {
      nomBebe: data.nomBebe,
      prenomBebe: data.prenomBebe,
      dateNaissance: data.dateNaissance,
      heureNaissance: data.heureNaissance,
      lieuNaissance: data.lieuNaissance,
      sexe: data.sexe,
      pere: data.pere,
      mere: data.mere,
      // Envoyer seulement l'ID de la mairie destinataire
      mairieDestinataire: data.mairieDestinataire,
    });
  },

  // Mettre à jour une pré-déclaration
  update: (id: string, data: Partial<BirthDeclaration>) => {
    // Validation des champs obligatoires lors de la mise à jour (si fournis)
    if (data.dateNaissance !== undefined && !data.dateNaissance) {
      throw new Error('Le champ dateNaissance est obligatoire.');
    }
    if (data.lieuNaissance !== undefined && !data.lieuNaissance) {
      throw new Error('Le champ lieuNaissance est obligatoire.');
    }
    if (data.heureNaissance !== undefined && !data.heureNaissance) {
      throw new Error('Le champ heureNaissance est obligatoire.');
    }
    if (data.sexe !== undefined && !['masculin', 'féminin'].includes(data.sexe || '')) {
      throw new Error('Le sexe doit être "masculin" ou "féminin".');
    }

    return api.put<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.BIRTH_DECLARATION(id), data);
  },

  // Supprimer une pré-déclaration
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(API_ENDPOINTS.BIRTH_DECLARATION(id)),

  // Valider une pré-déclaration (pour les mairies)
  validate: (id: string, statutValidation: 'validée' | 'refusée', commentaire?: string) =>
    api.put<ApiResponse<BirthDeclaration>>(API_ENDPOINTS.VALIDATE_BIRTH_DECLARATION(id), {
      statutValidation,
      commentaireValidation: commentaire,
    }),
};