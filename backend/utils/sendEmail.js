const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Correction ici : createTransport (sans 'er')
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Fonction pour envoyer un e-mail
 * @param {Object} param0 - Objet contenant les paramètres de l'email
 * @param {string} param0.to - Adresse e-mail du destinataire
 * @param {string} param0.subject - Sujet de l'e-mail
 * @param {string} param0.text - Corps texte de l'e-mail (optionnel)
 * @param {string} param0.html - Corps HTML de l'e-mail (optionnel)
 */
async function sendEmail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: `"Naissance Senegal" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendEmail;
