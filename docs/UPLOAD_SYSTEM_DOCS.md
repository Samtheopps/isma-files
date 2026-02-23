# 📁 Système d'Upload de Fichiers Audio - Documentation

## ✅ Fichiers créés/modifiés

### 🆕 Fichiers créés :

1. **`app/api/beats/[id]/upload/route.ts`**
   - API d'upload sécurisée (admin uniquement)
   - Gestion de MP3, WAV, Stems (ZIP)
   - Upload vers Cloudinary avec validation stricte
   - Mise à jour automatique du Beat en BDD

2. **`app/admin/beats/[id]/upload/page.tsx`**
   - Interface Matrix-themed avec animations GSAP
   - 3 zones de drag & drop (MP3, WAV, Stems)
   - Preview, progression, gestion d'erreurs
   - Affichage des URLs existantes

### 🔧 Fichiers modifiés :

3. **`app/admin/beats/[id]/edit/page.tsx`**
   - Ajout d'un bouton "📁 Uploader les fichiers audio"
   - Redirection vers la page d'upload

---

## 🎯 Fonctionnalités

### ✨ API d'Upload (`/api/beats/[id]/upload`)

**Méthode :** `POST`

**Authentification :** Bearer Token (Admin uniquement)

**Body :** `multipart/form-data`
- `mp3` (optionnel) : Fichier MP3 (max 50MB)
- `wav` (optionnel) : Fichier WAV (max 200MB)
- `stems` (optionnel) : Fichier ZIP (max 500MB)

**Validations :**
- Extensions : `.mp3`, `.wav`, `.zip`
- Tailles maximales strictes
- Au moins 1 fichier requis

**Réponse (succès 200) :**
```json
{
  "success": true,
  "message": "Upload terminé",
  "uploadedUrls": {
    "mp3": "https://res.cloudinary.com/...",
    "wav": "https://res.cloudinary.com/...",
    "stems": "https://res.cloudinary.com/..."
  },
  "beat": {
    "_id": "...",
    "title": "Beat Title",
    "files": { ... }
  }
}
```

**Réponse (erreur partielle 200) :**
```json
{
  "success": true,
  "uploadedUrls": { "mp3": "..." },
  "errors": ["WAV: Fichier trop volumineux"]
}
```

**Cloudinary :**
- Dossier : `isma-files/beats/{beatId}/`
- MP3/WAV : `resource_type: 'video'` (audio)
- Stems : `resource_type: 'raw'` (ZIP)
- Public ID : `{beatId}_mp3`, `{beatId}_wav`, `{beatId}_stems`
- Overwrite activé (remplace les anciens fichiers)

---

### 🎨 Interface Admin (`/admin/beats/[id]/upload`)

**Design Matrix :**
- Couleurs : `matrix-green`, `matrix-black`
- Animations GSAP (entrée en cascade, effets glitch)
- Typographie : `Clash Display` (titres), `Inter` (body)

**Fonctionnalités :**
1. **Drag & Drop** : Glissez-déposez vos fichiers
2. **Sélection manuelle** : Cliquez sur la zone pour ouvrir le file picker
3. **Preview** : Nom du fichier sélectionné + taille
4. **Validation en temps réel** : Erreurs affichées immédiatement
5. **Barre de progression** : Pour chaque fichier
6. **URLs actuelles** : Affiche les fichiers déjà uploadés
7. **États visuels** :
   - `idle` : Gris, prêt à recevoir
   - `uploading` : Vert + animation pulse
   - `success` : Vert + glow
   - `error` : Rouge + message

---

## 🧪 Instructions de test

### 1️⃣ Prérequis

**Variables d'environnement (`.env.local`) :**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=mongodb://...
JWT_SECRET=your_jwt_secret
```

**Compte admin requis :**
- Créer un utilisateur avec `role: 'admin'` dans MongoDB
- Se connecter via `/auth/login`

---

### 2️⃣ Test de l'API (Postman/Insomnia)

**Étape 1 :** Récupérer le token admin
```bash
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "votre_password"
}
```

**Étape 2 :** Uploader des fichiers
```bash
POST /api/beats/{beatId}/upload
Headers:
  Authorization: Bearer {token}
Body (form-data):
  mp3: fichier.mp3
  wav: fichier.wav
  stems: fichier.zip
```

**Tests à effectuer :**
- ✅ Upload MP3 seul
- ✅ Upload WAV seul
- ✅ Upload Stems seul
- ✅ Upload combiné (MP3 + WAV + Stems)
- ❌ Fichier trop gros (devrait échouer)
- ❌ Extension invalide `.txt` (devrait échouer)
- ❌ Sans token (401 Unauthorized)
- ❌ Token non-admin (401 Access denied)

---

### 3️⃣ Test de l'interface admin

**Étape 1 :** Se connecter en tant qu'admin
```
/auth/login
```

**Étape 2 :** Accéder à l'édition d'un beat
```
/admin/beats/{id}/edit
```

**Étape 3 :** Cliquer sur "📁 Uploader les fichiers audio"
```
/admin/beats/{id}/upload
```

**Tests visuels :**
- ✅ Animation d'entrée (cascade des cards)
- ✅ Effet glow sur le titre
- ✅ Drag & Drop fonctionnel
- ✅ Validation côté client (erreur immédiate)
- ✅ Barre de progression (simulée à 10% par 300ms)
- ✅ État "success" avec animation scale
- ✅ URLs existantes affichées (si déjà uploadés)
- ✅ Redirection après succès vers `/admin/beats`

**Tests fonctionnels :**
- ✅ Uploader un MP3 valide
- ✅ Uploader un WAV valide
- ✅ Uploader un ZIP valide (stems)
- ❌ Essayer un fichier trop gros → Message d'erreur
- ❌ Essayer une extension invalide → Message d'erreur
- ✅ Annuler et revenir à `/admin/beats`

---

### 4️⃣ Vérification Cloudinary

**Connectez-vous à votre Dashboard Cloudinary :**
```
https://cloudinary.com/console/media_library
```

**Vérifiez les dossiers :**
```
isma-files/
  └── beats/
      └── {beatId}/
          ├── {beatId}_mp3
          ├── {beatId}_wav
          └── {beatId}_stems
```

**Types de ressources :**
- MP3/WAV : Dans "Video" (Cloudinary traite l'audio comme video)
- Stems : Dans "Raw"

---

### 5️⃣ Vérification MongoDB

**Connectez-vous à MongoDB Compass ou CLI :**
```bash
mongo "mongodb://..."
use isma-files
db.beats.findOne({ _id: ObjectId("...") })
```

**Vérifiez les URLs :**
```json
{
  "files": {
    "mp3": "https://res.cloudinary.com/.../isma-files/beats/{id}/{id}_mp3.mp3",
    "wav": "https://res.cloudinary.com/.../isma-files/beats/{id}/{id}_wav.wav",
    "stems": "https://res.cloudinary.com/.../isma-files/beats/{id}/{id}_stems.zip"
  }
}
```

---

## 🐛 Problèmes potentiels et solutions

### Problème 1 : "No token provided" (401)
**Solution :** Vérifiez que le header `Authorization: Bearer {token}` est bien présent.

### Problème 2 : "Access denied: Admin role required" (401)
**Solution :** L'utilisateur n'est pas admin. Vérifiez `user.role === 'admin'` dans MongoDB.

### Problème 3 : Upload échoue silencieusement
**Solution :** 
- Vérifiez les variables d'environnement Cloudinary
- Vérifiez les logs serveur : `console.error('Cloudinary upload error:', error)`
- Testez la connexion Cloudinary avec `cloudinary.api.ping()`

### Problème 4 : Fichier trop gros (413 Payload Too Large)
**Solution :** Next.js limite par défaut le body à 4MB. Si besoin, augmenter dans `next.config.js` :
```js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '600mb', // Stems max
    },
  },
}
```

### Problème 5 : Progress bar ne s'affiche pas
**Solution :** La progression est simulée (par interval). Pour une vraie progression, utiliser `XMLHttpRequest` avec `onprogress` event au lieu de `fetch`.

---

## 🚀 Améliorations futures (optionnelles)

1. **Vraie progression d'upload** : Utiliser `XMLHttpRequest` + `upload.onprogress`
2. **Prévisualisation audio** : Player HTML5 pour écouter avant upload
3. **Analyse waveform** : Générer automatiquement `waveformData` depuis le fichier audio
4. **Compression automatique** : Optimiser la taille des fichiers avant upload
5. **Upload en parallèle** : Utiliser `Promise.all()` au lieu de séquentiel
6. **Retry automatique** : Retenter l'upload en cas d'échec réseau
7. **Suppression de fichiers** : Bouton pour supprimer un fichier de Cloudinary
8. **Historique d'uploads** : Logger les uploads dans une collection MongoDB

---

## 📝 Notes importantes

- ⚠️ **Sécurité** : Seuls les admins peuvent uploader (vérification JWT)
- ⚠️ **Coûts Cloudinary** : Les fichiers audio/video consomment plus de bande passante
- ⚠️ **Overwrite** : Les uploads écrasent les fichiers existants (par `public_id` identique)
- ✅ **BDD Sync** : Les URLs sont automatiquement mises à jour dans MongoDB après upload
- ✅ **Gestion d'erreurs** : Upload partiel supporté (ex: MP3 OK, WAV échec)

---

## 🎉 Résultat attendu

Après un upload réussi :

1. ✅ Fichiers présents sur Cloudinary
2. ✅ URLs mises à jour en BDD
3. ✅ Interface affiche "Upload réussi" avec animation
4. ✅ Redirection vers `/admin/beats`
5. ✅ Les beats peuvent maintenant être achetés/téléchargés avec les vrais fichiers

---

**Développé par :** Lead Fullstack Dev  
**Stack :** Next.js 14, TypeScript, MongoDB, Cloudinary, GSAP  
**Design :** Matrix Theme (Fresh Sky palette)
