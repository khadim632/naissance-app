const jwt = require("jsonwebtoken");
const { isBlacklisted } = require("../utils/tokenBlacklist");

exports.protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  const token = auth.split(" ")[1];

  if (isBlacklisted(token)) {
    return res.status(401).json({ message: "Token expiré ou déconnecté" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //const User = require('../models/User');
    const User = require('../models/User');
    const user = await User.findById(decoded.id); // ⬅️ fetch complet de l'utilisateur

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user; // ici, on a un objet complet avec ._id et .role
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Réservé au superadmin" });
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Réservé au superadmin" });
  }
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};

