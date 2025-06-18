const express = require("express");
const router = express.Router();
const { register, login, getUsers, forgotPassword, resetPassword, verifierToken, verifyResetToken } = require("../controllers/userController");
const { protect, isAdmin, isSuperAdmin } = require("../middlewares/authMiddleware");
const { addToBlacklist } = require("../utils/tokenBlacklist");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


router.post("/register", protect, isAdmin, register); // seuls admin ou superadmin
router.post("/login", login);
// Route unique pour récupérer les utilisateurs - combinée admin et superadmin
router.get("/", protect, (req, res, next) => {
  // Vérifier si l'utilisateur est admin ou superadmin
  if (req.user.role === 'admin' || req.user.role === 'superadmin' || req.user.role === 'hopital') {
    next();
  } else {
    return res.status(403).json({ message: "Accès refusé" });
  }
}, getUsers);


// Routes de réinitialisation de mot de passe
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken); // Nouvelle route
router.post("/reset-password/:token", resetPassword);

router.post("/logout", protect, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    addToBlacklist(token);
    res.json({ message: "Déconnexion réussie" });
  });

  router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Token manquant" });
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Token invalide" });
      }
  
      const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ message: "Token invalide ou expiré" });
    }
  });

  router.get("/verifier-token", verifierToken);

// Route pour la suppression d'utilisateurs
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;
    
    // Empêcher la suppression de son propre compte
    if (userId === currentUser.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    }
    
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Les admins ne peuvent supprimer que les hôpitaux et mairies
    if (currentUser.role === 'admin' && !['hopital', 'mairie'].includes(userToDelete.role)) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que les comptes hôpital et mairie" });
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour la mise à jour d'utilisateurs
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;
    const { nom, email, motDePasse, role } = req.body;
    
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Les admins ne peuvent modifier que les hôpitaux et mairies
    if (currentUser.role === 'admin' && !['hopital', 'mairie'].includes(userToUpdate.role)) {
      return res.status(403).json({ message: "Vous ne pouvez modifier que les comptes hôpital et mairie" });
    }
    
    // Les admins ne peuvent pas assigner des rôles admin/superadmin
    if (currentUser.role === 'admin' && ['admin', 'superadmin'].includes(role)) {
      return res.status(403).json({ message: "Vous ne pouvez pas assigner des rôles administrateur" });
    }
    
    const updateData = { nom, email, role };
    
    // Hasher le nouveau mot de passe s'il est fourni
    if (motDePasse) {
      const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!regex.test(motDePasse)) {
        return res.status(400).json({ message: "Mot de passe trop faible" });
      }
      const bcrypt = require("bcryptjs");
      updateData.motDePasse = await bcrypt.hash(motDePasse, 10);
    }
    
    await User.findByIdAndUpdate(userId, updateData);
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
module.exports = router;
