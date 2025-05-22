const express = require("express");
const router = express.Router();
const { register, login, getUsers, forgotPassword, resetPassword, verifierToken, verifyResetToken } = require("../controllers/userController");
const { protect, isAdmin, isSuperAdmin } = require("../middlewares/authMiddleware");
const { addToBlacklist } = require("../utils/tokenBlacklist");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


router.post("/register", protect, isAdmin, register); // seuls admin ou superadmin
router.post("/login", login);
router.get("/", protect, isSuperAdmin, getUsers);
router.get("/", protect, isAdmin, getUsers);


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
  
module.exports = router;
