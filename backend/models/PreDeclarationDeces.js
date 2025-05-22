const mongoose = require('mongoose');

const preDeclarationDecesSchema = new mongoose.Schema({
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
  descriptionMort: String,
  hopitalNom: String,
  hopitalEmail: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // utilisateur hopital
  }
}, { timestamps: true });

module.exports = mongoose.model('PreDeclarationDeces', preDeclarationDecesSchema);
