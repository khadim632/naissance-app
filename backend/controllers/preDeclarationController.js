const PreDeclarationNaissance = require('../models/PreDeclarationNaissance');
const PreDeclarationDeces = require('../models/PreDeclarationDeces');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // à créer

// Naissance
exports.creerPreDeclarationNaissance = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;

    // Vérifier que l'utilisateur connecté est un hôpital
    if (user.role !== 'hopital') {
      return res.status(403).json({ message: 'Accès refusé : seuls les hôpitaux peuvent créer des déclarations' });
    }

    // Vérifier la mairie destinataire
    const mairie = await User.findById(data.mairieDestinataire);
    if (!mairie || mairie.role !== 'mairie') {
      return res.status(400).json({ message: 'Mairie non trouvée ou invalide' });
    }

    // Créer la déclaration
    const declaration = new PreDeclarationNaissance({
      nomBebe: data.nomBebe,
      prenomBebe: data.prenomBebe,
      sexe: data.sexe,
      dateNaissance: data.dateNaissance,
      lieuNaissance: data.lieuNaissance,
      heureNaissance: data.heureNaissance,
      pere: data.pere,
      mere: data.mere,
      mairieDestinataire: mairie._id,
      createdBy: user._id,
      hopitalNom: user.nom || 'Hôpital sans nom',
      hopitalEmail: user.email,
    });

    await declaration.save();

    // Envoi de l'email aux parents
    const parentEmail = data.pere.email || data.mere.email;
    if (parentEmail) {
      await sendEmail({
        to: parentEmail,
        subject: 'Pré-déclaration de naissance enregistrée',
        text: `Bonjour,\n\nLa pré-déclaration de naissance de ${data.prenomBebe} ${data.nomBebe}, née le ${data.dateNaissance}, a été enregistrée avec succès.\nID de la déclaration : ${declaration._id}\nMairie destinataire : ${mairie.nom || mairie.email}\n\nCordialement,\nL'équipe`,
      });
    }

    res.status(201).json(declaration);
  } catch (err) {
    console.error('Erreur lors de la création de la déclaration:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
// Décès
exports.creerPreDeclarationDeces = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;

    const declaration = new PreDeclarationDeces({
        pere: data.pere,
        mere: data.mere,
        descriptionMort: data.descriptionMort,
        createdBy: user._id,
        hopitalNom: user.nom,         // Optionnel : à ajouter dans le schéma
        hopitalEmail: user.email      // Optionnel : à ajouter dans le schéma
      })

    await declaration.save();

    const parentEmail = data.pere.email || data.mere.email;
    if (parentEmail) {
      await sendEmail({
        to: parentEmail,
        subject: 'Pré-déclaration de décès infantile enregistrée',
        text: `Votre déclaration a bien été reçue.`
      });
    }

    res.status(201).json(declaration);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Afficher toutes les pré-déclarations de naissance de l'hôpital connecté
exports.getMesPreDeclarationsNaissance = async (req, res) => {
  try {
    
    const declarations = await PreDeclarationNaissance.find({ createdBy: req.user._id }).populate('mairieDestinataire', 'nom email');
    res.json(declarations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Afficher toutes les pré-déclarations (naissance + décès) de l'hôpital connecté
exports.getMesPreDeclarations = async (req, res) => {
  try {
    const [naissances, deces] = await Promise.all([
      PreDeclarationNaissance.find({ createdBy: req.user._id }).populate('mairieDestinataire', 'nom email'),
      PreDeclarationDeces.find({ createdBy: req.user._id })
    ]);
    res.json({ naissances, deces });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.modifierPreDeclaration = async (req, res) => {
  try {
    const userId = req.user._id;
    const preDeclarationId = req.params.id;

    // On cherche la pré-déclaration par ID et on s'assure que c'est bien celle de l'hôpital connecté
    const preDeclaration = await PreDeclarationNaissance.findOne({ _id: preDeclarationId, createdBy: userId });

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration non trouvée ou accès refusé." });
    }

    // Mise à jour des champs (req.body contient les champs à modifier)
    Object.assign(preDeclaration, req.body);
    await preDeclaration.save();

    res.json({ message: "Pré-déclaration mise à jour avec succès.", data: preDeclaration });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.modifierPreDeclarationNaissance = async (req, res) => {
  try {
    const preDeclarationId = req.params.id;
    let preDeclaration;

    // Si admin/superadmin => accès global
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      preDeclaration = await PreDeclarationNaissance.findById(preDeclarationId);
    } else {
      preDeclaration = await PreDeclarationNaissance.findOne({
        _id: preDeclarationId,
        createdBy: req.user._id
      });
    }

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration non trouvée ou accès refusé." });
    }

    Object.assign(preDeclaration, req.body);
    await preDeclaration.save();

    res.json({ message: "Pré-déclaration de naissance modifiée avec succès.", data: preDeclaration });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.modifierPreDeclarationDeces = async (req, res) => {
  try {
    const userId = req.user._id;
    const preDeclarationId = req.params.id;

    const preDeclaration = await PreDeclarationDeces.findOne({
      _id: preDeclarationId,
      createdBy: userId
    });

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration de décès non trouvée ou accès refusé." });
    }

    Object.assign(preDeclaration, req.body);
    await preDeclaration.save();

    res.json({ message: "Pré-déclaration de décès modifiée avec succès.", data: preDeclaration });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.supprimerPreDeclarationNaissance = async (req, res) => {
  try {
    const preDeclarationId = req.params.id;
    let preDeclaration;

    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      preDeclaration = await PreDeclarationNaissance.findByIdAndDelete(preDeclarationId);
    } else {
      preDeclaration = await PreDeclarationNaissance.findOneAndDelete({
        _id: preDeclarationId,
        createdBy: req.user._id
      });
    }

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration de naissance non trouvée ou accès refusé." });
    }

    res.json({ message: "Pré-déclaration de naissance supprimée avec succès." });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.supprimerPreDeclarationDeces = async (req, res) => {
  try {
    const userId = req.user._id;
    const preDeclarationId = req.params.id;

    const preDeclaration = await PreDeclarationDeces.findOneAndDelete({
      _id: preDeclarationId,
      createdBy: userId
    });

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration de décès non trouvée ou accès refusé." });
    }

    res.json({ message: "Pré-déclaration de décès supprimée avec succès." });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getPreDeclarationNaissanceById = async (req, res) => {
  try {
    const preDeclaration = await PreDeclarationNaissance.findById(req.params.id)
      .populate('mairieDestinataire', 'nom email');

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration de naissance non trouvée." });
    }

    // Accès : admin/superadmin ou créateur
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'superadmin' &&
      String(preDeclaration.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    res.json(preDeclaration);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getPreDeclarationDecesById = async (req, res) => {
  try {
    const preDeclaration = await PreDeclarationDeces.findById(req.params.id);

    if (!preDeclaration) {
      return res.status(404).json({ message: "Pré-déclaration de décès non trouvée." });
    }

    // Accès : admin/superadmin ou créateur
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'superadmin' &&
      String(preDeclaration.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    res.json(preDeclaration);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getStatistiquesParHopital = async (req, res) => {
  try {
    const userId = req.user._id;

    const [nbNaissances, nbDeces] = await Promise.all([
      PreDeclarationNaissance.countDocuments({ createdBy: userId }),
      PreDeclarationDeces.countDocuments({ createdBy: userId })
    ]);

    res.json({
        hopital: req.user.nom || req.user.email,
        nbNaissances,
        nbDeces,
        total: nbNaissances + nbDeces
});
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Corriger la fonction getStatistiquesGlobales
exports.getStatistiquesGlobales = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const [nbNaissances, nbDeces] = await Promise.all([
      PreDeclarationNaissance.countDocuments(),
      PreDeclarationDeces.countDocuments()
    ]);

    res.json({
      totalNaissances: nbNaissances,
      totalDeces: nbDeces,
      total: nbNaissances + nbDeces, // Correction: utiliser les bonnes variables
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Corriger la fonction getStatistiquesMairie pour être cohérente
exports.getStatistiquesMairie = async (req, res) => {
  try {
    if (req.user.role !== 'mairie') {
      return res.status(403).json({ message: "Accès réservé aux mairies." });
    }

    const mongoose = require('mongoose'); // Ajouter cet import si pas déjà fait

    const stats = await PreDeclarationNaissance.aggregate([
      { $match: { mairieDestinataire: mongoose.Types.ObjectId(req.user._id) } },
      { $group: {
          _id: "$statutValidation",
          count: { $sum: 1 }
        }
      }
    ]);

    // Transformer le résultat en format plus lisible
    const statistiques = {
      total: 0,
      enAttente: 0,
      validees: 0,
      refusees: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'en attente') statistiques.enAttente = stat.count;
      else if (stat._id === 'validée') statistiques.validees = stat.count;
      else if (stat._id === 'refusée') statistiques.refusees = stat.count;
      statistiques.total += stat.count;
    });

    res.json({
      mairie: req.user.nom || req.user.email,
      statistiques
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Ajouter une nouvelle fonction pour les statistiques de validation globales (optionnel)
exports.getStatistiquesValidationGlobales = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const stats = await PreDeclarationNaissance.aggregate([
      { $group: {
          _id: "$statutValidation",
          count: { $sum: 1 }
        }
      }
    ]);

    const statistiques = {
      total: 0,
      enAttente: 0,
      validees: 0,
      refusees: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'en attente' || !stat._id) statistiques.enAttente = stat.count;
      else if (stat._id === 'validée') statistiques.validees = stat.count;
      else if (stat._id === 'refusée') statistiques.refusees = stat.count;
      statistiques.total += stat.count;
    });

    res.json(statistiques);

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
exports.getStatistiquesParHopitalPourAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const statsNaissance = await PreDeclarationNaissance.aggregate([
      { $group: { _id: "$createdBy", totalNaissances: { $sum: 1 } } }
    ]);

    const statsDeces = await PreDeclarationDeces.aggregate([
      { $group: { _id: "$createdBy", totalDeces: { $sum: 1 } } }
    ]);

    // Fusionner les deux tableaux par _id (createdBy)
    const mergedStats = {};

    statsNaissance.forEach(stat => {
      mergedStats[stat._id] = { createdBy: stat._id, totalNaissances: stat.totalNaissances, totalDeces: 0 };
    });

    statsDeces.forEach(stat => {
      if (!mergedStats[stat._id]) {
        mergedStats[stat._id] = { createdBy: stat._id, totalNaissances: 0, totalDeces: stat.totalDeces };
      } else {
        mergedStats[stat._id].totalDeces = stat.totalDeces;
      }
    });

    // Récupérer les infos de l'utilisateur (nom, email) avec populate
    const results = await Promise.all(Object.values(mergedStats).map(async (stat) => {
      const user = await User.findById(stat.createdBy);
      return {
        hopital: user?.nom || user?.email,
        totalNaissances: stat.totalNaissances,
        totalDeces: stat.totalDeces
      };
    }));

    res.json(results);

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.afficherToutesLesPreDeclarations = async (req, res) => {
  try {
    const naissances = await PreDeclarationNaissance.find()
      .populate('mairieDestinataire', 'nom email') // afficher nom/email de la mairie
      .populate('createdBy', 'nom email role');     // afficher nom/email/role de celui qui a créé

    const deces = await PreDeclarationDeces.find()
      .populate('createdBy', 'nom email role');

    res.status(200).json({
      naissances,
      deces
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Afficher les pré-déclarations reçues par une mairie connectée
exports.listerPredeclarationsMairie = async (req, res) => {
  try {
    if (req.user.role !== 'mairie') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const declarations = await PreDeclarationNaissance.find({
      mairieDestinataire: req.user._id
    }).populate('createdBy', 'nom email');

    res.status(200).json(declarations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};
// Afficher toutes les pré-déclarations de décès de l'hôpital connecté
exports.getMesPreDeclarationsDeces = async (req, res) => {
  try {
    if (req.user.role !== 'hopital') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    const declarations = await PreDeclarationDeces.find({ createdBy: req.user._id }).populate('mairieDestinataire', 'nom email');
    res.json(declarations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Fonction pour permettre à une mairie de valider/refuser une pré-déclaration
exports.validerPreDeclarationNaissance = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est bien une mairie
    if (req.user.role !== 'mairie') {
      return res.status(403).json({ 
        message: "Seules les mairies peuvent valider les pré-déclarations." 
      });
    }

    const { id } = req.params;
    const { statutValidation, commentaire } = req.body;

    // Vérifier que le statut est valide
    if (!['validée', 'refusée'].includes(statutValidation)) {
      return res.status(400).json({ 
        message: "Le statut doit être 'validée' ou 'refusée'." 
      });
    }

    // Trouver la pré-déclaration
    const preDeclaration = await PreDeclarationNaissance.findById(id);

    if (!preDeclaration) {
      return res.status(404).json({ 
        message: "Pré-déclaration de naissance non trouvée." 
      });
    }

    // Vérifier que la mairie est bien celle assignée à cette pré-déclaration
    if (String(preDeclaration.mairieDestinataire) !== String(req.user._id)) {
      return res.status(403).json({ 
        message: "Cette pré-déclaration n'est pas destinée à votre mairie." 
      });
    }

    // Mettre à jour le statut
    preDeclaration.statutValidation = statutValidation;
    
    // Ajouter un commentaire si fourni
    if (commentaire) {
      preDeclaration.commentaireValidation = commentaire;
    }

    // Sauvegarder les modifications
    await preDeclaration.save();

    // Notifier l'hôpital qui a créé la pré-déclaration
    if (preDeclaration.hopitalEmail) {
      try {
        await sendEmail({
          to: preDeclaration.hopitalEmail,
          subject: `Pré-déclaration de naissance ${statutValidation}`,
          text: `La pré-déclaration de naissance pour ${preDeclaration.prenomBebe} ${preDeclaration.nomBebe} a été ${statutValidation} par la mairie.${commentaire ? `\n\nCommentaire: ${commentaire}` : ''}`
        });
      } catch (emailErr) {
        console.error("Erreur lors de l'envoi de l'email:", emailErr);
        // Ne pas bloquer la réponse en cas d'échec de l'email
      }
    }

    // Notifier les parents si un email est disponible
    const parentEmail = preDeclaration.pere?.email || preDeclaration.mere?.email;
    if (parentEmail) {
      try {
        await sendEmail({
          to: parentEmail,
          subject: `Déclaration de naissance ${statutValidation}`,
          text: `Votre déclaration de naissance pour ${preDeclaration.prenomBebe} ${preDeclaration.nomBebe} a été ${statutValidation} par la mairie.${commentaire ? `\n\nCommentaire: ${commentaire}` : ''}`
        });
      } catch (emailErr) {
        console.error("Erreur lors de l'envoi de l'email:", emailErr);
        // Ne pas bloquer la réponse en cas d'échec de l'email
      }
    }

    res.json({ 
      message: `Pré-déclaration ${statutValidation} avec succès.`, 
      data: preDeclaration 
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Ajoutez cette fonction à votre preDeclarationController.js existant

// ✅ Nouvelle fonction pour les statistiques de validation globales (pour compléter l'API)
exports.getStatistiquesValidationGlobales = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const stats = await PreDeclarationNaissance.aggregate([
      { $group: {
          _id: "$statutValidation",
          count: { $sum: 1 }
        }
      }
    ]);

    const statistiques = {
      total: 0,
      enAttente: 0,
      validees: 0,
      refusees: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'en attente' || !stat._id) statistiques.enAttente = stat.count;
      else if (stat._id === 'validée') statistiques.validees = stat.count;
      else if (stat._id === 'refusée') statistiques.refusees = stat.count;
      statistiques.total += stat.count;
    });

    res.json(statistiques);

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ✅ Amélioration de la fonction getStatistiquesMairie pour être plus robuste
exports.getStatistiquesMairie = async (req, res) => {
  try {
    if (req.user.role !== 'mairie') {
      return res.status(403).json({ message: "Accès réservé aux mairies." });
    }

    const mongoose = require('mongoose');

    const stats = await PreDeclarationNaissance.aggregate([
      { 
        $match: { 
          mairieDestinataire: new mongoose.Types.ObjectId(req.user._id)
        } 
      },
      { 
        $group: {
          _id: "$statutValidation",
          count: { $sum: 1 }
        }
      }
    ]);

    // Transformer le résultat en format plus lisible
    const statistiques = {
      total: 0,
      enAttente: 0,
      validees: 0,
      refusees: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'en attente' || !stat._id) {
        statistiques.enAttente = stat.count;
      } else if (stat._id === 'validée') {
        statistiques.validees = stat.count;
      } else if (stat._id === 'refusée') {
        statistiques.refusees = stat.count;
      }
      statistiques.total += stat.count;
    });

    res.json({
      mairie: req.user.nom || req.user.email,
      statistiques
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};