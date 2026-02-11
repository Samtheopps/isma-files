# Guide de Développement - Isma Files

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
cp .env.example .env.local
# Éditer .env.local avec vos credentials
npm run dev
```

### 2. Premier lancement
- Le serveur démarre sur http://localhost:3000
- La homepage est accessible immédiatement
- Pour l'admin, créez d'abord un utilisateur puis changez son rôle en "admin" dans MongoDB

## 📝 Prochaines Étapes de Développement

### Phase 1 - Core Features (En cours)
- [x] Setup projet Next.js 14 + TypeScript
- [x] Configuration Tailwind CSS
- [x] Modèles MongoDB (User, Beat, Order, Download)
- [x] Context API (Auth, Cart, Player)
- [x] Services externes (Stripe, Cloudinary, Email, PDF)
- [x] API Routes de base (Auth, Beats)
- [ ] Composants UI réutilisables (Button, Input, Modal, Card)
- [ ] Player audio avec Wavesurfer.js
- [ ] Système de filtres beats
- [ ] Interface panier

### Phase 2 - Pages Frontend
- [ ] Page catalogue beats avec filtres
- [ ] Page détail beat
- [ ] Page panier
- [ ] Page checkout
- [ ] Espace client (achats, téléchargements)
- [ ] Admin dashboard (CRUD beats, gestion commandes)

### Phase 3 - Intégration Paiements
- [ ] API checkout Stripe
- [ ] Webhook Stripe
- [ ] Génération PDF contrats
- [ ] Envoi emails confirmation
- [ ] Système de téléchargements sécurisés

### Phase 4 - Polish & Optimisations
- [ ] Animations Framer Motion
- [ ] Optimisation images (Next Image)
- [ ] SEO (metadata, sitemap)
- [ ] Tests
- [ ] Documentation API

## 🛠️ Commandes Utiles

```bash
npm run dev          # Dev server
npm run build        # Production build
npm start            # Start production server
npm run lint         # Lint code
npm run type-check   # Check TypeScript
```

## 📂 Structure des Fichiers

### Création d'une nouvelle page
```typescript
// app/(public)/ma-page/page.tsx
export default function MaPage() {
  return <div>Ma Page</div>;
}
```

### Création d'un nouveau composant
```typescript
// components/mon-composant/MonComposant.tsx
'use client'; // Si besoin de state/hooks

interface MonComposantProps {
  title: string;
}

export default function MonComposant({ title }: MonComposantProps) {
  return <div>{title}</div>;
}
```

### Création d'une nouvelle API route
```typescript
// app/api/mon-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

## 🔐 Authentification

L'authentification utilise JWT stocké dans localStorage.

```typescript
// Utilisation dans un composant
import { useAuth } from '@/context/AuthContext';

function MonComposant() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <button onClick={() => login(email, password)}>Login</button>;
  }
  
  return <button onClick={logout}>Logout</button>;
}
```

## 🛒 Panier

```typescript
import { useCart } from '@/context/CartContext';

function BeatCard({ beat }: { beat: IBeat }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (licenseType: LicenseType) => {
    addToCart({
      beatId: beat._id,
      beat,
      licenseType,
      price: beat.licenses.find(l => l.type === licenseType)?.price || 0,
    });
  };
  
  return <button onClick={() => handleAddToCart('basic')}>Add to Cart</button>;
}
```

## 🎵 Player Audio

```typescript
import { usePlayer } from '@/context/PlayerContext';

function BeatCard({ beat }: { beat: IBeat }) {
  const { play, pause, isPlaying, currentBeat } = usePlayer();
  
  const handlePlay = () => {
    if (currentBeat?._id === beat._id && isPlaying) {
      pause();
    } else {
      play(beat);
    }
  };
  
  return <button onClick={handlePlay}>
    {currentBeat?._id === beat._id && isPlaying ? 'Pause' : 'Play'}
  </button>;
}
```

## 🎨 Styles Tailwind

Les couleurs personnalisées sont définies dans `tailwind.config.ts`:

```tsx
<div className="bg-dark-bg">           {/* #0A0A0A */}
<div className="bg-dark-card">         {/* #1A1A1A */}
<div className="border-dark-border">   {/* #2A2A2A */}
<div className="bg-primary">           {/* #3B82F6 */}
<div className="bg-primary-dark">      {/* #2563EB */}
```

## 🔧 Débogage

### Vérifier la connexion MongoDB
```bash
# Dans un terminal Node.js
node
> require('./lib/db/mongodb.ts')
```

### Tester une API route
```bash
curl http://localhost:3000/api/beats
```

### Logs
Les logs apparaissent dans le terminal où `npm run dev` tourne.

## 📦 Ajout de dépendances

```bash
npm install nom-du-package
npm install -D nom-du-package-dev  # Dev dependency
```

## 🚀 Déploiement

Voir README.md section "Déploiement VPS OVH"

## 🆘 Troubleshooting

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "TypeScript error"
```bash
npm run type-check
```

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
```

---

**Bonne chance pour le développement ! 🎵**
