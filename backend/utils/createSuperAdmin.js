const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function createSuperAdmin() {
  const existing = await User.findOne({ role: "superadmin" });
  if (existing) return;

  const hash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
  await new User({
    nom: "Super Admin",
    email: process.env.SUPERADMIN_EMAIL,
    motDePasse: hash,
    role: "superadmin"
  }).save();

  console.log("✅ Superadmin créé avec succès");
}

module.exports = createSuperAdmin;
