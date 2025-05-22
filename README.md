# Système de Gestion des Pré-déclarations de Naissance et Décès

Ce projet est une application backend REST API qui facilite la communication entre les hôpitaux et les mairies pour la gestion des pré-déclarations de naissance et de décès. Il permet aux hôpitaux de soumettre des pré-déclarations qui seront ensuite validées ou refusées par les mairies concernées.

## 🌟 Fonctionnalités

### Authentification et Autorisation
- Système complet d'authentification avec JWT
- Gestion des rôles utilisateur (hôpital, mairie, admin, superadmin)
- Refresh token pour maintenir la session
- Blacklist des tokens lors de la déconnexion
- Réinitialisation de mot de passe via email

### Gestion des Pré-déclarations
- Création de pré-déclarations de naissance par les hôpitaux
- Création de pré-déclarations de décès par les hôpitaux
- Validation/refus des pré-déclarations par les mairies
- Commentaires sur les décisions de validation
- Notifications par email aux parties concernées

### Statistiques et Rapports
- Statistiques par hôpital
- Statistiques par mairie
- Statistiques globales (admin)
- Rapports détaillés sur les validations

## 🛠️ Technologies Utilisées

- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: JWT (JSON Web Tokens)
- **Emails**: Nodemailer
- **Sécurité**: bcryptjs pour le hachage des mots de passe

## 📋 Prérequis

- Node.js (v14+)
- MongoDB
- Compte Gmail pour l'envoi d'emails (ou autre service SMTP)

## ⚙️ Installation

1. Cloner le dépôt
```bash
git clone https://github.com/khadim632/gestion-predeclaration.git
cd gestion-predeclaration
```

2. Installer les dépendances
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet avec les variables suivantes
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/naissanceDB
JWT_SECRET=votre_secret_jwt
JWT_REFRESH_SECRET=votre_secret_jwt_refresh
SUPERADMIN_EMAIL=khadimndao632@gmail.com
SUPERADMIN_PASSWORD=MotDePasseComplexe123
MAIL_USER=khadimndao632@gmail.com
MAIL_PASS=votre_mot_de_passe_application
```

4. Démarrer le serveur
```bash
npm start
```

## 🚀 Structure du Projet

```
.
├── controllers/           # Logique métier
│   ├── preDeclarationController.js
│   └── userController.js
├── middlewares/           # Middlewares (auth, validation)
│   └── authMiddleware.js
├── models/                # Modèles Mongoose
│   ├── PreDeclarationDeces.js
│   ├── PreDeclarationNaissance.js
│   └── User.js
├── routes/                # Routes API
│   ├── preDeclarationRoutes.js
│   └── userRoutes.js
├── utils/                 # Utilitaires
│   ├── createSuperAdmin.js
│   ├── sendEmail.js
│   └── tokenBlacklist.js
├── .env                   # Variables d'environnement
├── package.json
└── server.js             # Point d'entrée de l'application
```

## 📚 API Endpoints

### Authentification
- `POST /api/users/register` - Enregistrement d'un nouvel utilisateur (admin seulement)
- `POST /api/users/login` - Connexion
- `POST /api/users/logout` - Déconnexion
- `POST /api/users/refresh-token` - Rafraîchir le token d'accès
- `POST /api/users/forgot-password` - Demande de réinitialisation de mot de passe
- `POST /api/users/reset-password/:token` - Réinitialisation du mot de passe

### Pré-déclarations de Naissance
- `POST /api/predeclarations/naissance` - Créer une pré-déclaration de naissance
- `GET /api/predeclarations/naissance` - Lister les pré-déclarations de naissance
- `GET /api/predeclarations/naissance/:id` - Détails d'une pré-déclaration
- `PUT /api/predeclarations/naissance/:id` - Modifier une pré-déclaration
- `DELETE /api/predeclarations/naissance/:id` - Supprimer une pré-déclaration
- `PUT /api/predeclarations/naissance/:id/validation` - Valider/refuser une pré-déclaration (mairie)

### Pré-déclarations de Décès
- `POST /api/predeclarations/deces` - Créer une pré-déclaration de décès
- `GET /api/predeclarations/deces` - Lister les pré-déclarations de décès
- `GET /api/predeclarations/deces/:id` - Détails d'une pré-déclaration
- `PUT /api/predeclarations/deces/:id` - Modifier une pré-déclaration
- `DELETE /api/predeclarations/deces/:id` - Supprimer une pré-déclaration

### Statistiques
- `GET /api/predeclarations/stats/hopital` - Stats pour l'hôpital connecté
- `GET /api/predeclarations/stats/mairie` - Stats pour la mairie connectée
- `GET /api/predeclarations/stats/globales` - Stats globales (admin)
- `GET /api/predeclarations/stats/par-hopital` - Stats détaillées par hôpital (admin)

## 🔐 Rôles et Permissions

### Hôpital
- Créer des pré-déclarations de naissance et de décès
- Consulter et modifier ses propres pré-déclarations
- Voir les statistiques de ses pré-déclarations

### Mairie
- Consulter les pré-déclarations qui lui sont destinées
- Valider ou refuser les pré-déclarations de naissance
- Ajouter des commentaires aux décisions
- Voir les statistiques de ses validations

### Admin
- Toutes les actions des hôpitaux et mairies
- Créer de nouveaux utilisateurs
- Consulter toutes les pré-déclarations
- Voir les statistiques globales

### Superadmin
- Toutes les actions des admins
- Accéder à la liste complète des utilisateurs
- Fonctionnalités étendues de gestion du système

## 🧪 Tests

Pour exécuter les tests (si implémentés) :
```bash
npm test
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- Nom de l'auteur - [GitHub](https://github.com/khadim632)

---

Pour toute question ou assistance, veuillez contacter [khadimndao632@gmail.com].