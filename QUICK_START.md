# 🚀 Quick Start - Isma Files

## Installation en 3 Minutes

### 1️⃣ Cloner et Installer
```bash
cd /Users/sami/Documents/isma-files
npm install
```
✅ **Fait** - 462 packages installés

### 2️⃣ Configurer l'Environnement
```bash
cp .env.example .env.local
nano .env.local  # ou code .env.local
```

**Remplissez au minimum :**
```env
# MongoDB (créer sur mongodb.com/cloud/atlas - gratuit)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ismafiles

# JWT (générer avec: openssl rand -hex 32)
JWT_SECRET=votre_clé_secrète_aléatoire_très_longue

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optionnels (pour fonctions complètes) :**
```env
# Cloudinary (cloudinary.com - gratuit 25GB)
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Stripe (stripe.com - mode test)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Email (Gmail avec app password)
EMAIL_USER=votre@email.com
EMAIL_PASSWORD=votre_mot_de_passe_app
```

### 3️⃣ Lancer le Projet
```bash
npm run dev
```

✨ **Ouvrez** → http://localhost:3000

---

## ⚡ Commandes Essentielles

```bash
npm run dev          # Lancer serveur dev
npm run build        # Build production
npm start            # Serveur production
npm run type-check   # Vérifier TypeScript
```

---

## 📱 Pages Disponibles

| URL | Description | Status |
|-----|-------------|--------|
| `/` | Homepage | ✅ Fait |
| `/beats` | Catalogue beats | 🔜 À faire |
| `/beats/[id]` | Détail beat | 🔜 À faire |
| `/cart` | Panier | 🔜 À faire |
| `/checkout` | Checkout | 🔜 À faire |
| `/account` | Espace client | 🔜 À faire |
| `/admin` | Dashboard admin | 🔜 À faire |

---

## 🔧 API Routes Créées

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Inscription |
| `/api/auth/login` | POST | Connexion |
| `/api/beats` | GET | Liste beats |

---

## 🎯 Premiers Pas

### Créer un Utilisateur Admin

1. **Lancez l'app** : `npm run dev`

2. **Créez un compte** via l'interface (à implémenter) ou MongoDB :
```javascript
// Via MongoDB Compass ou shell
use ismafiles

db.users.insertOne({
  email: "admin@ismafiles.com",
  password: "$2a$10$...", // Hash bcrypt de votre password
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  purchases: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

3. **Ou via API** :
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ismafiles.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

4. **Changer le rôle en admin** :
```javascript
db.users.updateOne(
  { email: "admin@ismafiles.com" },
  { $set: { role: "admin" } }
)
```

---

## 🎨 Stack Technique

```
Frontend
├─ Next.js 14 (App Router)
├─ TypeScript
├─ Tailwind CSS
└─ React Context API

Backend
├─ Next.js API Routes
├─ MongoDB + Mongoose
├─ JWT Authentication
└─ Stripe + Cloudinary + Email

Développement
└─ Git (4 commits)
```

---

## 📂 Fichiers Importants

```
.env.local              ← Configuration (ne pas commiter)
app/layout.tsx          ← Layout racine
app/providers.tsx       ← Context providers
models/                 ← Modèles MongoDB
lib/services/           ← Services externes
context/                ← État global
README.md               ← Documentation complète
ARCHITECTURE.md         ← Architecture détaillée
```

---

## 🐛 Dépannage

### Port 3000 déjà utilisé
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Erreur MongoDB connection
- Vérifiez `MONGODB_URI` dans `.env.local`
- Autorisez votre IP dans MongoDB Atlas
- Vérifiez user/password

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run type-check
```

---

## 📚 Documentation Complète

- **README.md** → Setup complet + déploiement
- **ARCHITECTURE.md** → Architecture technique détaillée
- **DEVELOPMENT.md** → Guide de développement
- **PROJECT_SETUP_COMPLETE.md** → Récapitulatif setup

---

## 🎵 Prochaines Étapes

1. ✅ **Setup projet** (TERMINÉ)
2. 🔜 **Créer composants UI** (Button, Input, Card, Modal)
3. 🔜 **Implémenter player audio** (Wavesurfer.js)
4. 🔜 **Page catalogue beats** (Grid + Filtres)
5. 🔜 **Système panier** (CartContext déjà créé)
6. 🔜 **Intégration Stripe** (Checkout + Webhook)
7. 🔜 **Admin dashboard** (CRUD beats)

---

## 💡 Conseils

- 🎯 **Commencez par les composants UI** (réutilisables partout)
- 🎨 **Utilisez Tailwind classes** (déjà configuré)
- 🔐 **Testez l'auth d'abord** (base de tout)
- 📦 **Un commit par feature** (historique propre)
- 🐛 **Type-check régulièrement** (`npm run type-check`)

---

**Projet créé le 11 février 2026**  
**Temps de setup : ~30 minutes**  
**Prêt pour le développement ! 🚀**
