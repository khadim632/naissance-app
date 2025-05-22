const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const controller = require('../controllers/preDeclarationController');

// ✅ Ces 3 rôles peuvent maintenant accéder à toutes les routes
const roles = ['hopital', 'admin', 'superadmin'];

// Routes existantes
router.post('/naissance', protect, authorizeRoles('hopital'), controller.creerPreDeclarationNaissance);
router.post('/deces', protect, authorizeRoles('hopital'), controller.creerPreDeclarationDeces);
router.get(
    '/predeclarations',
    protect,
    authorizeRoles('admin', 'superadmin'),
    controller.afficherToutesLesPreDeclarations
);

// Afficher toutes les pré-déclarations (naissance et décès)
router.get('/mes-predeclarations', protect, authorizeRoles(...roles), controller.getMesPreDeclarations);

// Afficher uniquement les pré-déclarations de naissance
router.get('/naissance', protect, authorizeRoles(...roles), controller.getMesPreDeclarationsNaissance);

// Afficher uniquement les pré-déclarations de décès
router.get('/deces', protect, authorizeRoles(...roles), controller.getMesPreDeclarationsDeces);

// Modifier une pré-déclaration (naissance ou décès)
router.put('/:id', protect, authorizeRoles(...roles), controller.modifierPreDeclaration);

// Modifier une pré-déclaration de naissance
router.put('/naissance/:id', protect, authorizeRoles(...roles), controller.modifierPreDeclarationNaissance);

// Modifier une pré-déclaration de décès
router.put('/deces/:id', protect, authorizeRoles(...roles), controller.modifierPreDeclarationDeces);

// Supprimer une pré-déclaration de naissance
router.delete('/naissance/:id', protect, authorizeRoles(...roles), controller.supprimerPreDeclarationNaissance);

// Supprimer une pré-déclaration de décès
router.delete('/deces/:id', protect, authorizeRoles(...roles), controller.supprimerPreDeclarationDeces);

router.get('/naissance/:id', protect, controller.getPreDeclarationNaissanceById);
router.get('/deces/:id', protect, controller.getPreDeclarationDecesById);

// routes/statistiques.js (ou dans routes principales)
router.get('/stats/hopital', protect, authorizeRoles(...roles), controller.getStatistiquesParHopital);
router.get('/stats/globales', protect, authorizeRoles(...roles), controller.getStatistiquesGlobales);
router.get('/stats/par-hopital', protect, authorizeRoles('admin', 'superadmin'), controller.getStatistiquesParHopitalPourAdmin);

// routes/predeclaration envoye a l'hopital connecte
router.get(
    '/predeclarations/mairie',
    protect,
    authorizeRoles('mairie'),
    controller.listerPredeclarationsMairie
);

// NOUVELLES ROUTES POUR LA VALIDATION PAR LES MAIRIES
// Route pour permettre à une mairie de valider ou refuser une pré-déclaration
router.put(
    '/naissance/:id/validation',
    protect,
    authorizeRoles('mairie'),
    controller.validerPreDeclarationNaissance
);

// Route pour les statistiques des validations pour une mairie
router.get(
    '/stats/mairie',
    protect,
    authorizeRoles('mairie'),
    controller.getStatistiquesMairie
);

module.exports = router;