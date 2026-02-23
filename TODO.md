# 📋 TODO - Phase 2 (Optionnel)

## 🎯 Tâches futures (si demandées)

### ⭐️ Priority High

#### 1. Page Transitions
- [ ] Créer `components/effects/PageTransition.tsx`
- [ ] Wipe effect Matrix code traversant l'écran
- [ ] Intégration Next.js App Router
- [ ] Transition: page out → wipe → page in
- [ ] Duration: 0.8s total

#### 2. Input Focus Effects
- [ ] Modifier `components/ui/Input.tsx`
- [ ] Border glow Matrix au focus (GSAP)
- [ ] Label floating animation
- [ ] Error shake animation (rotateZ ±5deg)
- [ ] Success checkmark animation (scale + opacity)

#### 3. LicenseModal animations
- [ ] Modifier `components/license/LicenseModal.tsx`
- [ ] Cards entrance stagger (0.1s delay)
- [ ] Selected card scale + glow
- [ ] Price number counter au changement
- [ ] Features list stagger reveal

---

### ⭐️ Priority Medium

#### 4. Toast Notifications
- [ ] Créer `components/ui/Toast.tsx`
- [ ] Stack animation (slide-in from right)
- [ ] Auto-dismiss avec progress bar
- [ ] Types: success, error, info, warning
- [ ] GSAP timeline pour entrance/exit

#### 5. Skeleton Loaders
- [ ] Créer `components/ui/Skeleton.tsx`
- [ ] Shimmer effect traversant (gradient animé)
- [ ] Variants: text, card, avatar, button
- [ ] Utiliser dans BeatGrid pendant loading

#### 6. Infinite Scroll avec Stagger
- [ ] Modifier `components/beat/BeatGrid.tsx`
- [ ] Fade-in stagger pour nouveaux items (0.05s)
- [ ] Intersection Observer pour lazy load
- [ ] Skeleton loaders pendant fetch

---

### ⭐️ Priority Low

#### 7. Micro-interactions avancées
- [ ] Logo Navbar: morphing SVG au hover
- [ ] Footer links: underline slide-in (left → right)
- [ ] Social icons: rotation + glow au hover
- [ ] Search input: expand animation au focus

#### 8. Loading States
- [ ] Page loader avec Matrix rain
- [ ] Button loading state (spinner + text)
- [ ] Image lazy load avec blur-up effect
- [ ] Progress bar pour checkout

---

### 🚀 Optimizations avancées

#### 9. Accessibility
- [ ] `prefers-reduced-motion` support complet
  - [ ] Détecter avec media query
  - [ ] Désactiver animations complexes
  - [ ] Garder transitions essentielles (feedback)
  - [ ] Alternative visuelle pour curseur

#### 10. Performance
- [ ] Intersection Observer pour lazy animations
  - [ ] Ne pas animer hors viewport
  - [ ] Cleanup quand élément invisible
- [ ] Virtual scrolling pour BeatGrid (>100 items)
- [ ] Image optimization (next/image + blur placeholder)
- [ ] Code splitting par route

---

### 🎨 WebGL Upgrade (Expérimental)

#### 11. Three.js Particles
- [ ] Créer `components/effects/WebGLParticles.tsx`
- [ ] Remplacement de MatrixParticles
- [ ] GPU compute shaders pour 1000+ particles
- [ ] Post-processing effects (glow, bloom)
- [ ] Fallback Canvas si WebGL non supporté

---

## 📊 Critères d'acceptation

Chaque feature doit :
- ✅ Être demandée explicitement par l'utilisateur
- ✅ TypeScript strict (0 errors)
- ✅ Build Next.js success
- ✅ 60fps constant
- ✅ Mobile responsive
- ✅ SSR safe
- ✅ Documentation (README update)
- ✅ Tests manuels (Chrome + Safari)

---

## 🛠 Tech Stack pour Phase 2

### Dépendances potentielles
```json
{
  "react-intersection-observer": "^9.x",  // Lazy load
  "react-hot-toast": "^2.x",              // Toast (ou custom GSAP)
  "three": "^0.182.0",                    // Déjà installé
  "@react-three/fiber": "^8.x",           // Déjà installé
  "@react-three/postprocessing": "^2.x"   // Déjà installé
}
```

Pas besoin d'installer maintenant, seulement si features demandées.

---

## 📝 Notes

- **Ne pas implémenter** sans demande explicite
- **Toujours confirmer** le scope avant de coder
- **Documenter** chaque feature ajoutée
- **Tester** sur mobile + desktop

---

**Status actuel** : Phase 1 complète ✅  
**Phase 2** : En attente de demande utilisateur  
**Date** : 2024
