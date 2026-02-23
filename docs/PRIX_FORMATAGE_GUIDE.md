# Guide du Formatage des Prix

## 📋 Contexte

Dans cette application, **tous les prix sont stockés en centimes** dans MongoDB et envoyés à Stripe en centimes.

Exemple : 
- 4900 centimes = 49.00€
- 2950 centimes = 29.50€

## 🛠 Helper Centralisé

Fichier : `lib/utils/formatPrice.ts`

### Fonctions disponibles

```typescript
// 1. Format standard avec 2 décimales (pour totaux, détails)
formatPrice(4900) → "49.00€"

// 2. Format arrondi sans décimales (pour cartes, listes)
formatPriceRounded(4900) → "49€"

// 3. Format internationalisé FR (pour admin)
formatPriceIntl(4900) → "49,00 €"

// 4. Conversion euros → centimes (pour forms)
eurosToCents(49.00) → 4900
```

## 📍 Où utiliser chaque fonction

### `formatPriceRounded()` - Sans décimales
✅ Listes de beats (BeatCard, BeatListItem)
✅ Prix affichés sur les cartes
✅ Panier (items individuels)
✅ Tags de prix rapides

### `formatPrice()` - Avec 2 décimales
✅ Totaux de commandes
✅ Subtotaux et totaux avec TVA
✅ Pages de détail (checkout, order detail)
✅ Résumés financiers

### `formatPriceIntl()` - Format locale FR
✅ Dashboard admin
✅ Statistiques de revenus
✅ Exports et rapports

## ⚠️ RÈGLES IMPORTANTES

### ❌ NE JAMAIS FAIRE
```typescript
// ❌ Conversion inline
{(price / 100).toFixed(2)}€

// ❌ Formatage manuel
{price / 100}€

// ❌ Calculs sans arrondi
{price * 1.2 / 100}€
```

### ✅ TOUJOURS FAIRE
```typescript
// ✅ Import du helper
import { formatPrice, formatPriceRounded } from '@/lib/utils/formatPrice';

// ✅ Utilisation directe
{formatPrice(order.totalAmount)}

// ✅ Calcul puis formatage
{formatPrice(Math.round(price * 1.2))}
```

## 🔄 Pipeline des Prix

```
[MongoDB] → [API] → [Frontend]
  4900   →  4900  →  formatPrice() → "49.00€"
```

### 1. Stockage (MongoDB)
```javascript
beat.licenses[0].price = 4900  // centimes
order.totalAmount = 4900       // centimes
```

### 2. API Routes (pas de conversion)
```javascript
// Les routes API manipulent toujours des centimes
const price = beat.licenses[0].price; // 4900
```

### 3. Stripe (centimes)
```javascript
// Stripe reçoit toujours des centimes
line_items: [{
  price_data: {
    unit_amount: 4900, // centimes
    currency: 'eur',
  }
}]
```

### 4. Frontend (conversion à l'affichage)
```typescript
// Conversion uniquement au moment de l'affichage
<p>{formatPrice(beat.price)}</p> // "49.00€"
```

## 🧪 Tests de Validation

```typescript
// Test 1: Prix basic
formatPrice(4900) === "49.00€" ✅

// Test 2: Prix avec décimales
formatPrice(2950) === "29.50€" ✅

// Test 3: Prix arrondi
formatPriceRounded(4900) === "49€" ✅

// Test 4: Prix intl
formatPriceIntl(4900) === "49,00 €" ✅

// Test 5: Conversion
eurosToCents(49.00) === 4900 ✅
```

## 📁 Fichiers Modifiés (Référence)

### Public
- `components/beat/BeatCard.tsx`
- `components/beat/BeatListItem.tsx`
- `app/(public)/beats/[id]/page.tsx`
- `app/(public)/cart/page.tsx`
- `app/(public)/checkout/page.tsx`

### Panier
- `components/cart/CartDrawer.tsx`
- `components/cart/CartSummary.tsx`
- `components/cart/CartItem.tsx`
- `components/cart/CartItemRow.tsx`

### License
- `components/license/LicenseModal.tsx`
- `components/license/LicenseSelector.tsx`

### Admin
- `components/admin/BeatTable.tsx`
- `components/admin/OrderTable.tsx`
- `components/admin/OrderDetailModal.tsx`
- `app/admin/page.tsx`
- `app/admin/beats/page.tsx`
- `app/admin/orders/page.tsx`

### Account
- `app/(protected)/account/page.tsx`
- `app/(protected)/account/orders/[id]/page.tsx`
- `app/(protected)/account/purchases/page.tsx`

## 🚀 Pour Ajouter un Nouveau Composant

```typescript
// 1. Importer le helper
import { formatPrice } from '@/lib/utils/formatPrice';

// 2. Utiliser directement
export const MyComponent = ({ price }: { price: number }) => {
  return (
    <div>
      Prix: {formatPrice(price)}
    </div>
  );
};
```

## 🔍 Debugging

Si un prix s'affiche incorrectement :

1. **Vérifier la source** : Le prix est-il bien en centimes ?
2. **Vérifier l'import** : Le helper est-il importé ?
3. **Vérifier l'usage** : Utilise-t-on le bon helper ?

```typescript
// Debug dans la console
console.log('Prix brut:', price); // 4900
console.log('Prix formaté:', formatPrice(price)); // "49.00€"
```

---

**Note finale** : Toute modification du formatage des prix doit se faire dans `lib/utils/formatPrice.ts` pour garantir la cohérence à travers toute l'application.
