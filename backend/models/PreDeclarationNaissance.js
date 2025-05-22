const mongoose = require('mongoose');

const preDeclarationNaissanceSchema = new mongoose.Schema({
  nomBebe: String,
  prenomBebe: String,
  dateNaissance: Date,
  lieuNaissance: String,
  heureNaissance: String,
  sexe: { type: String, required: true },
  hopitalNom: String,
  hopitalEmail: String,
  pere: {
    nom: String,
    prenom: String,
    telephone: String,
    email: String,
    carteIdentite: String
  },
  mere: {
    nom: String,
    prenom: String,
    telephone: String,
    email: String,
    carteIdentite: String
  },
  mairieDestinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // utilisateur avec rôle mairie
  },
  statutValidation: {
    type: String,
    enum: ['en attente', 'validée', 'refusée'],
    default: 'en attente'
  },
  commentaireValidation: {
    type: String,
    default: ''
  },
  dateValidation: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // utilisateur hopital
  }
  
}, { timestamps: true });

module.exports = mongoose.model('PreDeclarationNaissance', preDeclarationNaissanceSchema);