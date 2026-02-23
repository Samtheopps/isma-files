# 🎵 Système d'Upload de Beats - Quick Start

## 📦 Ce qui a été créé

### 1. API d'Upload
**Fichier :** `app/api/beats/[id]/upload/route.ts`

- Upload MP3, WAV, Stems vers Cloudinary
- Protection admin (JWT)
- Validation stricte (taille, extension)
- Met à jour automatiquement MongoDB

### 2. Interface Admin
**Fichier :** `app/admin/beats/[id]/upload/page.tsx`

- Design Matrix avec animations GSAP
- Drag & Drop + sélection manuelle
- Barre de progression
- Gestion d'erreurs en temps réel

### 3. Lien dans l'édition
**Modifié :** `app/admin/beats/[id]/edit/page.tsx`

- Bouton "📁 Uploader les fichiers audio"
- Redirection vers la page d'upload

---

## 🚀 Test rapide

### 1. Se connecter en admin
```
/auth/login
```

### 2. Éditer un beat
```
/admin/beats/{id}/edit
```

### 3. Cliquer sur "📁 Uploader les fichiers audio"

### 4. Glisser-déposer vos fichiers :
- MP3 (max 50MB)
- WAV (max 200MB)
- ZIP/Stems (max 500MB)

### 5. Cliquer sur "Uploader les fichiers"

✅ Les fichiers sont envoyés à Cloudinary et les URLs sont mises à jour en BDD !

---

## 🧪 Test de l'API (cURL)

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Récupérer le token dans la réponse

# 2. Upload
curl -X POST http://localhost:3000/api/beats/{beatId}/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "mp3=@path/to/file.mp3" \
  -F "wav=@path/to/file.wav" \
  -F "stems=@path/to/stems.zip"
```

---

## 📖 Documentation complète

Voir **`UPLOAD_SYSTEM_DOCS.md`** pour :
- Détails techniques
- Tests complets
- Résolution de problèmes
- Améliorations futures

---

## ✅ Checklist de vérification

- [ ] Variables d'environnement Cloudinary configurées
- [ ] Utilisateur admin créé en BDD (role: 'admin')
- [ ] Beat existant en BDD pour tester
- [ ] Fichiers audio de test préparés (MP3, WAV, ZIP)
- [ ] Connexion admin fonctionnelle
- [ ] Page d'upload accessible depuis `/admin/beats/{id}/upload`
- [ ] Upload fonctionne (fichiers sur Cloudinary + URLs en BDD)

---

## 🎨 Capture d'écran attendue

```
┌─────────────────────────────────────────────────┐
│  Upload Fichiers Audio                          │
│  Beat: My Awesome Beat                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ Fichier MP3 ]          [En attente]         │
│  Format standard (max 50MB)                     │
│  ┌─────────────────────────────────┐           │
│  │         ⬆️                      │           │
│  │  Glissez-déposez ou cliquez    │           │
│  │         .mp3                    │           │
│  └─────────────────────────────────┘           │
│                                                 │
│  [ Fichier WAV ]          [En attente]         │
│  Haute qualité (max 200MB)                      │
│  ┌─────────────────────────────────┐           │
│  │         📁                      │           │
│  │      mybeat.wav                 │           │
│  │   Cliquez pour changer          │           │
│  └─────────────────────────────────┘           │
│                                                 │
│  [ Stems (ZIP) ]          [Terminé] ✓          │
│  Fichiers séparés (max 500MB)                   │
│  ┌─────────────────────────────────┐           │
│  │  ✓ Upload réussi                │           │
│  └─────────────────────────────────┘           │
│                                                 │
├─────────────────────────────────────────────────┤
│  [ Annuler ]         [Uploader les fichiers]   │
└─────────────────────────────────────────────────┘
```

---

**🔥 Prêt à uploader des beats !**
