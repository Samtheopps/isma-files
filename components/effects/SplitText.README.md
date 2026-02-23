# SplitText Component

## Description

Composant React avancé utilisant GSAP et le plugin SplitText pour créer des animations de texte lettre par lettre, mot par mot ou ligne par ligne avec déclenchement au scroll.

## Dépendances

- `gsap` (^3.14.2)
- `gsap-trial` (^3.12.7) - **Note:** Pour la production, vous devez acheter une licence GSAP Club GreenSock
- `@gsap/react` (^2.1.2)

## ⚠️ Important : Licence GSAP

Le plugin `SplitText` est un **plugin premium** de GSAP. Pour l'utiliser en production, vous devez :

1. Acheter une licence Club GreenSock : https://greensock.com/club/
2. Remplacer `gsap-trial` par les packages officiels avec authentification

## Utilisation

```tsx
import { SplitText } from '@/components/effects';

<SplitText
  text="ISMA FILES"
  className="text-9xl font-bold text-matrix-green"
  delay={30}              // Délai entre chaque caractère (ms)
  duration={1}            // Durée de l'animation (s)
  ease="power3.out"       // Easing GSAP
  splitType="chars"       // 'chars' | 'words' | 'lines' | 'words, chars'
  from={{ opacity: 0, y: 50, rotateX: -90 }}
  to={{ opacity: 1, y: 0, rotateX: 0 }}
  threshold={0.2}         // Seuil d'Intersection Observer (0-1)
  rootMargin="0px"        // Marge pour le scroll trigger
  tag="h1"                // HTML tag à utiliser
  textAlign="center"      // Alignement du texte
  onLetterAnimationComplete={() => console.log('Animation terminée!')}
/>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `text` | `string` | **requis** | Le texte à animer |
| `className` | `string` | `''` | Classes CSS supplémentaires |
| `delay` | `number` | `50` | Délai entre chaque élément (ms) |
| `duration` | `number` | `1.25` | Durée de l'animation (s) |
| `ease` | `string \| function` | `'power3.out'` | Fonction d'easing GSAP |
| `splitType` | `'chars' \| 'words' \| 'lines' \| 'words, chars'` | `'chars'` | Type de découpage |
| `from` | `gsap.TweenVars` | `{ opacity: 0, y: 40 }` | État initial de l'animation |
| `to` | `gsap.TweenVars` | `{ opacity: 1, y: 0 }` | État final de l'animation |
| `threshold` | `number` | `0.1` | Seuil de visibilité (0-1) |
| `rootMargin` | `string` | `'-100px'` | Marge du scroll trigger |
| `tag` | `'h1' \| 'h2' \| ... \| 'p' \| 'span'` | `'p'` | Tag HTML à utiliser |
| `textAlign` | `React.CSSProperties['textAlign']` | `'center'` | Alignement du texte |
| `onLetterAnimationComplete` | `() => void` | `undefined` | Callback à la fin de l'animation |

## Optimisations appliquées

### Performance
- ✅ Memoization des props `from` et `to` pour éviter les re-renders
- ✅ `willChange` CSS pour optimiser les transformations GPU
- ✅ `force3D: true` pour activer l'accélération matérielle
- ✅ Détection du chargement des fonts pour éviter les FOUT

### SSR & Hydration
- ✅ Guard contre `window` et `document` undefined
- ✅ `'use client'` directive pour Next.js
- ✅ Enregistrement conditionnel des plugins GSAP côté client uniquement

### Memory Management
- ✅ Cleanup complet des instances ScrollTrigger
- ✅ Revert des instances SplitText au démontage
- ✅ Try/catch autour des opérations de cleanup
- ✅ Prévention de la ré-animation après completion

## Styles CSS

Le composant nécessite ces styles (déjà ajoutés dans `globals.css`) :

```css
.split-char,
.split-word,
.split-line {
  display: inline-block;
  transform-origin: center bottom;
  will-change: transform, opacity;
}
```

## Exemples d'animations

### Animation 3D Flip
```tsx
<SplitText
  text="TITRE 3D"
  splitType="chars"
  from={{ opacity: 0, rotateX: -90, y: 50 }}
  to={{ opacity: 1, rotateX: 0, y: 0 }}
  delay={40}
/>
```

### Animation Slide from Left
```tsx
<SplitText
  text="SLIDE IN"
  splitType="words"
  from={{ opacity: 0, x: -100 }}
  to={{ opacity: 1, x: 0 }}
  delay={100}
  ease="back.out(1.7)"
/>
```

### Animation Scale + Fade
```tsx
<SplitText
  text="APPARITION"
  splitType="chars"
  from={{ opacity: 0, scale: 0 }}
  to={{ opacity: 1, scale: 1 }}
  delay={20}
  ease="elastic.out(1, 0.5)"
/>
```

## Troubleshooting

### L'animation ne se déclenche pas
- Vérifiez que les fonts sont bien chargées
- Vérifiez le `threshold` et `rootMargin`
- Assurez-vous que l'élément est visible dans le viewport

### Performance lente
- Réduisez le nombre de caractères animés
- Utilisez `splitType="words"` au lieu de `"chars"`
- Simplifiez les transformations dans `from`/`to`

### Erreur "SplitText is not a constructor"
- Vérifiez que `gsap-trial` est bien installé
- Pour la production, achetez une licence Club GreenSock
- Vérifiez l'import : `import { SplitText } from 'gsap/SplitText'`

## Migration depuis ASCIIText

Si vous migrez depuis ASCIIText :

```tsx
// AVANT (ASCIIText)
<ASCIIText 
  text="TITRE" 
  fontSize={120} 
/>

// APRÈS (SplitText)
<SplitText
  text="TITRE"
  className="text-9xl font-bold"
  splitType="chars"
  delay={30}
/>
```

## Credits

- Basé sur le code de [react-bits.dev](https://reactbits.dev/text-animations/split-text)
- Utilise GSAP et le plugin SplitText par GreenSock
- Optimisé pour Next.js 14+ et React 18+
