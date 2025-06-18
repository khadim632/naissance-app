const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { isBlacklisted } = require("../utils/tokenBlacklist");

exports.register = async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;
  const currentUser = req.user;

  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!regex.test(motDePasse)) {
    return res.status(400).json({ message: "Mot de passe trop faible" });
  }

  // Les admins ne peuvent créer que des comptes hôpital et mairie
  if (currentUser.role === 'admin' && !['hopital', 'mairie'].includes(role)) {
    return res.status(403).json({ message: "Vous ne pouvez créer que des comptes hôpital et mairie" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const hash = await bcrypt.hash(motDePasse, 10);
    const user = new User({ nom, email, motDePasse: hash, role });
    await user.save();
    res.status(201).json({ message: "Utilisateur enregistré" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const valid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    const { role } = req.query; // Récupérer le paramètre role
    let query = {};

    if (currentUser.role === 'superadmin') {
      // Le superadmin voit tous les utilisateurs
      query = role ? { role } : {};
    } else if (currentUser.role === 'admin') {
      // L'admin voit les hôpitaux et mairies
      query = role
        ? { role, role: { $in: ['hopital', 'mairie'] } }
        : { role: { $in: ['hopital', 'mairie'] } };
    } else if (currentUser.role === 'hopital') {
      // Les hôpitaux peuvent voir uniquement les mairies
      if (role !== 'mairie') {
        return res.status(403).json({ message: "Accès refusé : vous ne pouvez voir que les mairies" });
      }
      query = { role: 'mairie' };
    } else {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const users = await User.find(query).select('nom email role');
    res.json({ data: users }); // Retourner les utilisateurs dans un objet avec la clé "data"
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpire = Date.now() + 3600000; // 1h

    user.resetToken = resetToken;
    user.resetTokenExpire = tokenExpire;
    await user.save();

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`; // Changé pour pointer vers le frontend
    const htmlContent = `<p>Bonjour ${user.nom},</p>
<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
<a href="${resetURL}">${resetURL}</a>
<p>Ce lien expire dans 1 heure.</p>`;

    // Appel corrigé avec un objet contenant tous les paramètres
    await sendEmail({
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      text: `Bonjour ${user.nom}, Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetURL}`,
      html: htmlContent
    });

    res.json({ message: "Email envoyé avec succès" });
  } catch (err) {
    console.error("Erreur forgotPassword:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { motDePasse } = req.body;

  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!regex.test(motDePasse)) {
    return res.status(400).json({ message: "Mot de passe invalide" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token invalide ou expiré" });

    const hashed = await bcrypt.hash(motDePasse, 10);
    user.motDePasse = hashed;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifierToken = (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = auth.split(" ")[1];

  if (require("../utils/tokenBlacklist").isBlacklisted(token)) {
    return res.status(401).json({ message: "Token expiré ou déconnecté" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Token valide", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// À ajouter dans userController.js
exports.verifyResetToken = async (req, res) => {
  const { token } = req.params;
  
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ valid: false, message: "Token invalide ou expiré" });
    }

    res.json({ valid: true, message: "Token valide" });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
};