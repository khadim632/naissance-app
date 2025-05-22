const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: String,
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['hopital', 'mairie', 'admin', 'superadmin'], 
    default: 'hopital' 
  },
  resetToken: String,
  resetTokenExpire: Date,
  refreshToken: String,

});


module.exports = mongoose.model("User", userSchema);
