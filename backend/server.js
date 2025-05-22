const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const createSuperAdmin = require("./utils/createSuperAdmin");
const preDeclarationRoutes = require('./routes/preDeclarationRoutes'); // ajuster le chemin
const cors = require("cors"); // Ajouter le package cors

dotenv.config();
const app = express();
app.use(express.json());

// Activer CORS
app.use(cors({
    origin: "http://localhost:5173", // Autoriser le frontend Vite
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
}));


app.use("/api/users", userRoutes);
app.use('/api/predeclarations', preDeclarationRoutes); // << important


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connexion MongoDB réussie");
    await createSuperAdmin();
    app.listen(process.env.PORT, () => console.log(`🚀 Serveur sur le port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
