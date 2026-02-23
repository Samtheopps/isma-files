# 🌍 Migration i18n - État d'avancement

## ✅ Phase 1 : Configuration next-intl (TERMINÉE)

**Fichiers créés :**
- `i18n.ts` - Configuration centrale
- `middleware.ts` - Détection automatique de locale
- `navigation.ts` - Helpers de navigation (Link, redirect, etc.)
- `messages/fr.json` - 400+ traductions françaises
- `messages/en.json` - 400+ traductions anglaises

## ✅ Phase 2 : Restructuration (TERMINÉE)

**Modifications :**
- Création de `app/[locale]/` pour toutes les pages UI
- Déplacement de tous les fichiers sauf `app/api/`
- Nouveau `app/[locale]/layout.tsx` avec `NextIntlClientProvider`
- Configuration de `next.config.js` avec plugin next-intl
- Suppression de l'ancien `app/layout.tsx`

**Structure actuelle :**
```
app/
├── [locale]/
│   ├── (public)/        # Pages publiques
│   ├── (protected)/     # Pages protégées
│   ├── admin/           # Interface admin
│   └── layout.tsx       # Root layout avec i18n
└── api/                 # Routes API (inchangées)
```

## 🚧 Phase 3 : Migration pages publiques (À FAIRE)

**Pages à migrer :**
- [ ] `app/[locale]/(public)/page.tsx` - Homepage
- [ ] `app/[locale]/(public)/beats/page.tsx` - Liste beats
- [ ] `app/[locale]/(public)/beats/[id]/page.tsx` - Détail beat
- [ ] `app/[locale]/(public)/cart/page.tsx` - Panier
- [ ] `app/[locale]/(public)/checkout/page.tsx` - Checkout
- [ ] `app/[locale]/(public)/checkout/success/page.tsx` - Success
- [ ] `app/[locale]/(public)/auth/login/page.tsx` - Login
- [ ] `app/[locale]/(public)/auth/register/page.tsx` - Register

**Actions requises pour chaque page :**
1. Remplacer imports `next/link` par `@/navigation` (Link avec i18n)
2. Ajouter `import { useTranslations } from 'next-intl'`
3. Remplacer textes en dur par `t('key')`
4. Adapter `generateMetadata` avec `getTranslations`

## 🚧 Phase 4 : Migration pages protégées (À FAIRE)

**Pages à migrer :**
- [ ] `app/[locale]/(protected)/account/page.tsx`
- [ ] `app/[locale]/(protected)/account/downloads/page.tsx`
- [ ] `app/[locale]/(protected)/account/orders/[id]/page.tsx`
- [ ] `app/[locale]/(protected)/account/purchases/page.tsx`
- [ ] `app/[locale]/(public)/downloads/guest/[token]/page.tsx`

## 🚧 Phase 5 : Migration composants (À FAIRE)

**Composants à migrer :**
- [ ] `components/layout/Navbar.tsx` - Navigation principale
- [ ] `components/layout/Footer.tsx` (si existe)
- [ ] `components/beat/BeatCard.tsx`
- [ ] `components/beat/BeatListItem.tsx`
- [ ] `components/beat/BeatFilters.tsx`
- [ ] `components/cart/CartDrawer.tsx`
- [ ] `components/cart/CartSummary.tsx`
- [ ] `components/cart/CartItem.tsx`
- [ ] `components/license/LicenseModal.tsx`
- [ ] `components/license/LicenseSelector.tsx`
- [ ] `components/auth/LoginForm.tsx`
- [ ] `components/auth/RegisterForm.tsx`
- [ ] `components/ui/Button.tsx` (si textes en dur)

## 🚧 Phase 6 : Migration services (À FAIRE)

**Services à adapter :**
- [ ] `lib/services/email.service.ts` - Emails multilingues
- [ ] `lib/services/pdf.service.ts` - PDF multilingues

**Stratégie :**
- Détecter la locale de l'utilisateur depuis le contexte de commande
- Charger les traductions dynamiquement
- Créer des templates FR et EN

## 🚧 Phase 7 : LanguageSwitcher (À FAIRE)

**Composant à créer :**
- [ ] `components/LanguageSwitcher.tsx` - Switch FR/EN dans navbar

**Fonctionnalités :**
- Afficher la locale actuelle
- Permettre de basculer entre FR et EN
- Conserver le même chemin lors du switch
- Design cohérent avec le theme cyber

## 📝 Notes de migration

### Imports à remplacer
```typescript
// AVANT
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// APRÈS
import { Link, useRouter } from '@/navigation';
```

### Usage des traductions
```typescript
// Composant Client
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <div>{t('key')}</div>;
}

// Composant Server
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

### Metadata dynamiques
```typescript
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}) {
  const t = await getTranslations({ locale, namespace: 'metadata.page' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}
```

## 🔗 URLs après migration

**Toutes les URLs nécessitent un préfixe de locale :**
- `/` → `/fr/` ou `/en/`
- `/beats` → `/fr/beats` ou `/en/beats`
- `/cart` → `/fr/cart` ou `/en/cart`

**Les routes API restent sans préfixe :**
- `/api/beats` → inchangé
- `/api/orders/checkout` → inchangé

## ⚠️ Points d'attention

1. **Ne jamais toucher `/app/api/`** - Les routes API sont hors i18n
2. **Noms des beats** - Ne pas traduire les titres de beats (restent originaux)
3. **Prix et dates** - Utiliser le formatage approprié selon la locale
4. **Admin** - Peut rester en français (interface privée)

## 🧪 Tests à effectuer

- [ ] Navigation FR ↔ EN fonctionne
- [ ] Détection auto de la locale
- [ ] Tous les liens fonctionnent
- [ ] Cart/Checkout multilingue
- [ ] Emails dans la bonne langue
- [ ] PDF dans la bonne langue
- [ ] Metadata SEO correctes

---

**Dernière mise à jour :** Phase 2 terminée le 23/02/2026

---

## 🎉 Phase 3 : Migration pages publiques (EN COURS - 44%)

**Pages migrées : 4/9**

✅ **Migrées avec succès :**
- `app/[locale]/(public)/page.tsx` - Homepage
- `app/[locale]/(public)/beats/page.tsx` - Beats listing
- `app/[locale]/(public)/auth/login/page.tsx` - Login
- `app/[locale]/(public)/auth/register/page.tsx` - Register

🚧 **À migrer :**
- `app/[locale]/(public)/cart/page.tsx` - Cart
- `app/[locale]/(public)/checkout/page.tsx` - Checkout
- `app/[locale]/(public)/checkout/success/page.tsx` - Success
- `app/[locale]/(public)/beats/[id]/page.tsx` - Beat detail
- `app/[locale]/(public)/downloads/guest/[token]/page.tsx` - Downloads guest

**Modifications apportées :**
- Remplacement de `import Link from 'next/link'` par `import { Link } from '@/navigation'`
- Ajout de `useTranslations()` dans chaque composant
- Remplacement de tous les textes en dur par des clés de traduction
- Ajout de la clé `search.loading` dans les fichiers JSON

**Tests effectués :**
- Type-checking : ✅ Passe
- Build : Non testé (à faire)
- Navigation FR/EN : À tester manuellement

---

**Dernière mise à jour :** Phase 3 partiellement terminée (4/9 pages) le 23/02/2026
