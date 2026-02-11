# Isma Files - Plateforme de Vente d'Instrumentales

Plateforme e-commerce moderne pour la vente de beats et instrumentales musicales, développée avec Next.js 14, TypeScript, MongoDB et Stripe.

## 🎵 Fonctionnalités

### Pour les Clients
- ✅ Catalogue de beats avec filtres avancés (genre, BPM, mood, etc.)
- ✅ Player audio avec waveform (preview 30-60sec)
- ✅ Système de licences multiples (Basic, Standard, Pro, Unlimited, Exclusive)
- ✅ Panier et checkout sécurisé via Stripe
- ✅ Téléchargement instantané après paiement (MP3, WAV, Stems)
- ✅ Génération automatique de contrats de licence (PDF)
- ✅ Espace client avec historique d'achats
- ✅ Design responsive (mobile-first)

### Pour l'Admin
- ✅ Dashboard de gestion
- ✅ Upload et gestion des beats
- ✅ Gestion des commandes
- ✅ Analytics et statistiques
- ✅ Configuration des licences et prix

## 🚀 Stack Technique

### Frontend
- **Next.js 14** (App Router) - Framework React avec SSR
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne et responsive
- **Framer Motion** - Animations fluides
- **Wavesurfer.js** - Player audio avec waveform
- **React Context API** - State management

### Backend
- **Next.js API Routes** - API REST intégrée
- **MongoDB + Mongoose** - Base de données NoSQL
- **Stripe** - Paiements sécurisés
- **Cloudinary** - Stockage et CDN pour fichiers audio/images
- **Nodemailer** - Envoi d'emails
- **PDFKit** - Génération de contrats PDF
- **JWT** - Authentication

## 📁 Structure du Projet

```
isma-files/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication
│   │   ├── beats/              # Beats CRUD
│   │   ├── orders/             # Orders & Checkout
│   │   └── admin/              # Admin endpoints
│   ├── (public)/               # Pages publiques
│   │   ├── page.tsx            # Homepage
│   │   ├── beats/              # Catalogue
│   │   ├── cart/               # Panier
│   │   └── checkout/           # Checkout
│   ├── (protected)/            # Pages authentifiées
│   │   └── account/            # Espace client
│   ├── admin/                  # Admin dashboard
│   ├── layout.tsx              # Layout root
│   ├── globals.css             # Styles globaux
│   └── providers.tsx           # Context providers
├── components/                  # Composants React
│   ├── player/                 # Player audio
│   ├── beat/                   # Composants beats
│   ├── cart/                   # Composants panier
│   ├── license/                # Sélection licence
│   └── ui/                     # Composants UI réutilisables
├── context/                     # React Context
│   ├── AuthContext.tsx         # Authentication
│   ├── CartContext.tsx         # Panier
│   └── PlayerContext.tsx       # Player audio
├── lib/                         # Utilitaires
│   ├── db/                     # Database connection
│   ├── services/               # Services externes
│   │   ├── stripe.service.ts
│   │   ├── cloudinary.service.ts
│   │   ├── email.service.ts
│   │   └── pdf.service.ts
│   ├── utils/                  # Helpers
│   └── hooks/                  # Custom hooks
├── models/                      # Modèles MongoDB
│   ├── User.ts
│   ├── Beat.ts
│   ├── Order.ts
│   └── Download.ts
├── types/                       # TypeScript types
│   ├── index.ts                # Types globaux
│   └── api.ts                  # Types API
├── public/                      # Assets statiques
├── .env.example                # Variables d'environnement exemple
├── next.config.js              # Configuration Next.js
├── tailwind.config.ts          # Configuration Tailwind
└── tsconfig.json               # Configuration TypeScript
```

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte MongoDB Atlas (gratuit)
- Compte Cloudinary (gratuit)
- Compte Stripe

### 1. Cloner le projet

```bash
git clone <repository-url>
cd isma-files
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Éditez `.env.local` et remplissez vos credentials :

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ismafiles

# JWT
JWT_SECRET=votre_clé_secrète_très_longue_et_complexe
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application
EMAIL_FROM=noreply@ismafiles.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Isma Files
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📚 Configuration des Services Externes

### MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit (M0)
3. Créez un utilisateur de base de données
4. Autorisez votre IP (ou 0.0.0.0/0 pour dev)
5. Récupérez la connection string et collez-la dans `MONGODB_URI`

### Cloudinary

1. Créez un compte sur [Cloudinary](https://cloudinary.com/)
2. Récupérez vos credentials dans le Dashboard
3. Collez-les dans les variables `CLOUDINARY_*`

### Stripe

1. Créez un compte sur [Stripe](https://stripe.com/)
2. Activez le mode test
3. Récupérez vos clés API (Publishable et Secret key)
4. Pour les webhooks :
   ```bash
   # Installer Stripe CLI
   stripe listen --forward-to localhost:3000/api/orders/webhook
   # Récupérer le webhook secret (whsec_xxx)
   ```

### Email (Gmail)

1. Activez la validation en 2 étapes sur votre compte Google
2. Générez un mot de passe d'application : [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Utilisez ce mot de passe dans `EMAIL_PASSWORD`

## 🎯 Utilisation

### Créer le premier admin

```bash
# Via MongoDB Compass ou shell
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

### Upload un beat (Admin)

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin/beats`
3. Cliquez sur "Nouveau Beat"
4. Uploadez :
   - Preview audio (30-60sec MP3)
   - Fichier MP3 complet
   - Fichier WAV
   - Stems (ZIP)
   - Cover image
5. Remplissez les métadonnées (BPM, key, genre, etc.)
6. Configurez les licences et prix
7. Publiez

### Acheter un beat (Client)

1. Parcourez le catalogue sur `/beats`
2. Écoutez les previews
3. Sélectionnez une licence
4. Ajoutez au panier
5. Checkout via Stripe
6. Recevez l'email avec liens de téléchargement
7. Téléchargez vos fichiers + contrat PDF

## 📦 Build & Déploiement

### Build de production

```bash
npm run build
npm start
```

### Déploiement VPS OVH

```bash
# 1. Connectez-vous à votre VPS
ssh user@your-vps-ip

# 2. Installez Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clonez le projet
git clone <repository-url>
cd isma-files

# 4. Installez les dépendances
npm install

# 5. Configurez les variables d'environnement
nano .env.local

# 6. Build
npm run build

# 7. Lancez avec PM2
npm install -g pm2
pm2 start npm --name "isma-files" -- start
pm2 save
pm2 startup
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build de production
npm start            # Lancer le serveur de production
npm run lint         # Linter le code
npm run type-check   # Vérifier les types TypeScript
```

## 📝 Licences Disponibles

| Licence    | Prix  | MP3 | WAV | Stems | Streams   | Ventes   | Exclusivité |
|------------|-------|-----|-----|-------|-----------|----------|-------------|
| Basic      | 40€   | ✅  | ❌  | ❌    | 50,000    | 500      | Non         |
| Standard   | 60€   | ✅  | ✅  | ❌    | 100,000   | 1,000    | Non         |
| Pro        | 100€  | ✅  | ✅  | ✅    | 250,000   | 2,500    | Non         |
| Unlimited  | 200€  | ✅  | ✅  | ✅    | Illimité  | Illimité | Non         |
| Exclusive  | 500€+ | ✅  | ✅  | ✅    | Illimité  | Illimité | Oui         |

## 🤝 Contribution

Ce projet est personnel. Pour toute suggestion, ouvrez une issue.

## 📄 License

Propriétaire - Tous droits réservés

---

**Développé avec ❤️ pour Isma Files**
