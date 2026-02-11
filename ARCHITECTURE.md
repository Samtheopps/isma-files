# Architecture Isma Files

## Vue d'Ensemble du Système

```
┌─────────────────────────────────────────────────────────────────┐
│                         ISMA FILES                               │
│              Plateforme E-commerce de Beats                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   FRONTEND       │──────│   BACKEND        │──────│   SERVICES       │
│   Next.js 14     │      │   API Routes     │      │   EXTERNES       │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │                          │                          │
        ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ • React Server   │      │ • MongoDB Atlas  │      │ • Stripe         │
│   Components     │      │ • Mongoose ODM   │      │ • Cloudinary     │
│ • Client Comp.   │      │ • JWT Auth       │      │ • Nodemailer     │
│ • Tailwind CSS   │      │ • Validation     │      │ • PDFKit         │
│ • Framer Motion  │      │ • Error Handler  │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

## Flow de Données

### 1. Authentification
```
Client                     Backend                    Database
  │                           │                           │
  ├─ POST /api/auth/register ─→                          │
  │                           ├─ Hash password           │
  │                           ├─ Create user ───────────→ │
  │                           ←─ Return user + token ────┤
  ←─ Store token (localStorage)                          │
  │                                                       │
```

### 2. Navigation Catalogue
```
Client                     Backend                    Database
  │                           │                           │
  ├─ GET /api/beats?genre=trap─→                         │
  │                           ├─ Build query             │
  │                           ├─ Fetch beats ───────────→ │
  │                           ←─ Return paginated ───────┤
  ←─ Display beats grid                                  │
  │                                                       │
  ├─ Click play button                                   │
  │  (Stream preview from Cloudinary)                    │
  ←─ WaveformPlayer renders                              │
```

### 3. Achat Beat
```
Client              Backend              Stripe           Cloudinary
  │                    │                    │                 │
  ├─ Add to cart       │                    │                 │
  │  (CartContext)     │                    │                 │
  │                    │                    │                 │
  ├─ Checkout ────────→│                    │                 │
  │                    ├─ Create session ──→│                 │
  │                    ←─ Session URL ──────┤                 │
  ←─ Redirect Stripe                        │                 │
  │                                          │                 │
  ├─ Pay ─────────────────────────────────→ │                 │
  │                                          │                 │
  │                    ←─ Webhook ──────────┤                 │
  │                    │ (payment success)  │                 │
  │                    │                    │                 │
  │                    ├─ Create Order                        │
  │                    ├─ Generate PDF                        │
  │                    ├─ Upload PDF ──────────────────────→ │
  │                    ├─ Create Download links              │
  │                    ├─ Send Email                          │
  │                    │  (with download links)               │
  │                    │                                      │
  ←─ Redirect /success │                                      │
  │                    │                                      │
```

## Structure Dossiers Détaillée

```
isma-files/
│
├─ app/                                 # Next.js 14 App Router
│  │
│  ├─ (public)/                        # Routes publiques
│  │  ├─ page.tsx                      # Homepage
│  │  ├─ beats/                        
│  │  │  ├─ page.tsx                   # Catalogue beats
│  │  │  └─ [id]/page.tsx              # Détail beat
│  │  ├─ cart/page.tsx                 # Panier
│  │  └─ checkout/page.tsx             # Checkout
│  │
│  ├─ (protected)/                     # Routes authentifiées
│  │  └─ account/
│  │     ├─ page.tsx                   # Dashboard client
│  │     ├─ purchases/page.tsx         # Historique achats
│  │     └─ downloads/page.tsx         # Téléchargements
│  │
│  ├─ admin/                           # Admin dashboard
│  │  ├─ page.tsx                      # Dashboard admin
│  │  ├─ beats/page.tsx                # Gestion beats
│  │  └─ orders/page.tsx               # Gestion commandes
│  │
│  ├─ api/                             # API Routes
│  │  ├─ auth/
│  │  │  ├─ register/route.ts          # POST - Inscription
│  │  │  └─ login/route.ts             # POST - Connexion
│  │  ├─ beats/
│  │  │  ├─ route.ts                   # GET - Liste beats
│  │  │  └─ [id]/route.ts              # GET - Détail beat
│  │  ├─ orders/
│  │  │  ├─ checkout/route.ts          # POST - Créer session Stripe
│  │  │  └─ webhook/route.ts           # POST - Webhook Stripe
│  │  └─ admin/
│  │     └─ beats/route.ts             # POST/PUT/DELETE - CRUD beats
│  │
│  ├─ layout.tsx                       # Layout racine (Providers)
│  ├─ globals.css                      # Styles globaux
│  └─ providers.tsx                    # Context Providers wrapper
│
├─ components/                          # Composants React
│  ├─ player/
│  │  ├─ WaveformPlayer.tsx            # Player principal
│  │  ├─ PlayerControls.tsx            # Contrôles (play/pause/volume)
│  │  └─ MiniPlayer.tsx                # Mini player sticky
│  ├─ beat/
│  │  ├─ BeatCard.tsx                  # Card beat dans grid
│  │  ├─ BeatGrid.tsx                  # Grid de beats
│  │  ├─ BeatFilters.tsx               # Filtres (genre, BPM, etc.)
│  │  └─ BeatDetail.tsx                # Vue détaillée beat
│  ├─ cart/
│  │  ├─ CartItem.tsx                  # Item dans panier
│  │  ├─ CartSummary.tsx               # Résumé panier
│  │  └─ CartDrawer.tsx                # Drawer panier
│  ├─ license/
│  │  ├─ LicenseSelector.tsx           # Sélection licence
│  │  └─ LicenseModal.tsx              # Modal infos licence
│  └─ ui/
│     ├─ Button.tsx                    # Bouton réutilisable
│     ├─ Input.tsx                     # Input réutilisable
│     ├─ Modal.tsx                     # Modal générique
│     └─ Card.tsx                      # Card générique
│
├─ context/                             # React Context API
│  ├─ AuthContext.tsx                  # État auth global
│  ├─ CartContext.tsx                  # État panier global
│  └─ PlayerContext.tsx                # État player global
│
├─ lib/                                 # Bibliothèques utilitaires
│  ├─ db/
│  │  └─ mongodb.ts                    # Connexion MongoDB (cache)
│  ├─ services/
│  │  ├─ stripe.service.ts             # Intégration Stripe
│  │  ├─ cloudinary.service.ts         # Upload/Download fichiers
│  │  ├─ email.service.ts              # Envoi emails
│  │  └─ pdf.service.ts                # Génération PDF contrats
│  ├─ utils/
│  │  ├─ auth.ts                       # JWT helpers
│  │  └─ validators.ts                 # Validation données
│  └─ hooks/
│     ├─ useAuth.ts                    # Hook auth
│     ├─ useCart.ts                    # Hook panier
│     └─ usePlayer.ts                  # Hook player
│
├─ models/                              # Modèles MongoDB
│  ├─ User.ts                          # Utilisateurs
│  ├─ Beat.ts                          # Beats/Instrumentales
│  ├─ Order.ts                         # Commandes
│  └─ Download.ts                      # Téléchargements
│
├─ types/                               # Types TypeScript
│  ├─ index.ts                         # Types globaux
│  └─ api.ts                           # Types API
│
└─ public/                              # Assets statiques
   ├─ images/
   └─ fonts/
```

## Modèles de Données

### User
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed bcrypt),
  firstName: string,
  lastName: string,
  role: 'user' | 'admin',
  purchases: ObjectId[] (ref: Order),
  createdAt: Date,
  updatedAt: Date
}
```

### Beat
```typescript
{
  _id: ObjectId,
  title: string,
  bpm: number (60-200),
  key: string,
  genre: string[],
  mood: string[],
  tags: string[],
  previewUrl: string (Cloudinary),
  coverImage: string (Cloudinary),
  waveformData: { peaks: number[], duration: number },
  files: {
    mp3: string (Cloudinary),
    wav: string (Cloudinary),
    stems: string (Cloudinary ZIP)
  },
  licenses: [{
    type: 'basic' | 'standard' | 'pro' | 'unlimited' | 'exclusive',
    price: number,
    available: boolean,
    features: {
      mp3: boolean,
      wav: boolean,
      stems: boolean,
      streams: number (-1 = unlimited),
      physicalSales: number,
      exclusivity: boolean
    }
  }],
  isActive: boolean,
  playCount: number,
  salesCount: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```typescript
{
  _id: ObjectId,
  orderNumber: string (unique, auto-generated),
  userId: ObjectId (ref: User),
  items: [{
    beatId: ObjectId (ref: Beat),
    beatTitle: string,
    licenseType: string,
    price: number
  }],
  totalAmount: number,
  stripePaymentId: string,
  stripeSessionId: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  licenseContract: string (Cloudinary PDF),
  deliveryEmail: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Download
```typescript
{
  _id: ObjectId,
  orderId: ObjectId (ref: Order),
  userId: ObjectId (ref: User),
  beatId: ObjectId (ref: Beat),
  licenseType: string,
  downloadCount: number (max: 3),
  maxDownloads: number (default: 3),
  expiresAt: Date (30 days after creation),
  files: {
    mp3?: string (signed URL),
    wav?: string (signed URL),
    stems?: string (signed URL),
    contract: string (PDF URL)
  },
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Créer compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Utilisateur actuel

### Beats (Public)
- `GET /api/beats` - Liste beats (avec filtres/pagination)
- `GET /api/beats/:id` - Détail beat
- `GET /api/beats/:id/preview` - Stream preview audio

### Orders
- `POST /api/orders/checkout` - Créer session Stripe
- `POST /api/orders/webhook` - Webhook Stripe
- `GET /api/orders/:id` - Détail commande

### Account (Protected)
- `GET /api/account/purchases` - Historique achats
- `GET /api/account/downloads/:orderId` - Liens téléchargement
- `POST /api/account/download/:fileId` - Télécharger fichier

### Admin (Admin only)
- `POST /api/admin/beats` - Créer beat
- `PUT /api/admin/beats/:id` - Modifier beat
- `DELETE /api/admin/beats/:id` - Supprimer beat
- `GET /api/admin/orders` - Liste commandes
- `GET /api/admin/analytics` - Stats

## Sécurité

### Authentification
- JWT stocké dans localStorage (client)
- Token inclus dans header `Authorization: Bearer <token>`
- Vérification token dans middleware Next.js
- Expiration token : 7 jours

### Passwords
- Hash avec bcrypt (salt rounds: 10)
- Jamais retourné dans les API responses
- Validation : min 6 caractères

### Paiements
- Stripe Checkout (PCI compliant)
- Webhooks signés (HMAC)
- Montants en centimes (éviter erreurs float)

### Fichiers
- URLs signées Cloudinary (expiration 1h)
- Limite téléchargements (3 max)
- Expiration accès (30 jours)

### Input Validation
- Zod schemas pour validation
- Sanitization avant DB insert
- Rate limiting (à implémenter)

## Performance

### Optimisations
- MongoDB indexes (genre, BPM, createdAt)
- Connection pooling MongoDB
- Next.js Image optimization
- Lazy loading composants
- Server Components par défaut
- ISR pour pages statiques

### Caching
- MongoDB connection cache (global)
- Cloudinary CDN
- Next.js automatic caching

## Déploiement

### Environnements
```
Development   → localhost:3000
Production    → VPS OVH
```

### Variables d'Environnement
- `.env.local` (dev, git-ignoré)
- Variables serveur (production)

### Build Process
```bash
npm run build    # Génère .next/
npm start        # Lance serveur production
```

---

**Architecture v1.0 - Février 2026**
