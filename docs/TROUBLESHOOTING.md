# 🛠️ TROUBLESHOOTING GUIDE - Beat Upload System

## 🔴 Authentication Issues

### ❌ Error: "No token provided" (401)

**Symptom:**
```json
{ "error": "No token provided" }
```

**Causes:**
1. Missing `Authorization` header
2. Header format incorrect
3. Token not saved in localStorage

**Solutions:**
```typescript
// ✅ Correct format
headers: {
  'Authorization': `Bearer ${token}`
}

// ❌ Wrong formats
headers: {
  'Authorization': token           // Missing "Bearer"
  'Auth': `Bearer ${token}`        // Wrong header name
}

// Check localStorage
console.log(localStorage.getItem('token'));
```

**Verification:**
```bash
curl -X POST localhost:3000/api/beats/{id}/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "mp3=@file.mp3"
```

---

### ❌ Error: "Access denied: Admin role required" (401)

**Symptom:**
```json
{ "error": "Access denied: Admin role required" }
```

**Causes:**
1. User is not admin (role !== 'admin')
2. Token belongs to regular user

**Solutions:**

**Check user role in MongoDB:**
```bash
mongo "mongodb://..."
use isma-files
db.users.findOne({ email: "admin@example.com" })

# Should return:
{
  _id: ObjectId("..."),
  email: "admin@example.com",
  role: "admin"  // ← Must be "admin"
}
```

**Update user to admin:**
```bash
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

### ❌ Error: "Invalid or expired token"

**Symptom:**
Frontend redirects to login unexpectedly

**Causes:**
1. JWT expired (default: 7 days)
2. JWT_SECRET changed
3. Token corrupted

**Solutions:**
1. Re-login to get fresh token
2. Check JWT_SECRET in `.env.local` matches deployed version
3. Clear localStorage and re-login

```typescript
// Debug token
import jwt from 'jsonwebtoken';
const decoded = jwt.decode(localStorage.getItem('token'));
console.log('Token expires:', new Date(decoded.exp * 1000));
```

---

## 🔴 File Validation Issues

### ❌ Error: "Extension invalide" (400)

**Symptom:**
```json
{ "error": "Extension invalide pour MP3. Attendu: .mp3" }
```

**Causes:**
1. Wrong file extension
2. File renamed incorrectly
3. Uppercase extension (.MP3 vs .mp3)

**Solutions:**
```bash
# Check actual file type
file myfile.mp3
# Should output: "myfile.mp3: Audio file with ID3..."

# If it says "ASCII text" or other, file was renamed incorrectly

# Convert file properly
ffmpeg -i input.wav -acodec libmp3lame -b:a 320k output.mp3
```

**Allowed extensions (case-insensitive):**
- MP3: `.mp3`
- WAV: `.wav`
- Stems: `.zip`

---

### ❌ Error: "Fichier trop volumineux" (400)

**Symptom:**
```json
{ "error": "Le fichier MP3 dépasse la limite de 50MB" }
```

**Causes:**
1. File exceeds size limits
2. Uncompressed audio (e.g., WAV as MP3)

**Solutions:**

**Size limits:**
- MP3: 50MB max
- WAV: 200MB max
- Stems: 500MB max

**Compress files:**
```bash
# Compress MP3 to 320kbps
ffmpeg -i input.mp3 -b:a 320k output.mp3

# Compress WAV
ffmpeg -i input.wav -acodec pcm_s16le output.wav

# Compress ZIP
zip -9 stems.zip *.wav  # Maximum compression
```

**Check file size:**
```bash
ls -lh myfile.mp3
# Output: -rw-r--r--  1 user  staff   45M Feb 23 10:00 myfile.mp3
```

---

### ❌ Error: "Aucun fichier fourni" (400)

**Symptom:**
```json
{ "error": "Aucun fichier fourni" }
```

**Causes:**
1. FormData empty
2. Wrong field names
3. File input not populated

**Solutions:**

**Verify FormData:**
```typescript
const formData = new FormData();
formData.append('mp3', file); // ✅ Correct

// ❌ Wrong field names
formData.append('audio', file);  // Should be 'mp3'
formData.append('file', file);   // Should be specific type

// Debug FormData
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
```

---

## 🔴 Cloudinary Issues

### ❌ Error: "Failed to upload MP3 to Cloudinary"

**Symptom:**
Upload fails silently or with generic error

**Causes:**
1. Invalid Cloudinary credentials
2. API rate limit exceeded
3. File format not supported
4. Network timeout

**Solutions:**

**1. Verify credentials:**
```bash
# Check .env.local
CLOUDINARY_CLOUD_NAME=your_cloud_name  # ← Must match dashboard
CLOUDINARY_API_KEY=123456789012345     # ← 15 digits
CLOUDINARY_API_SECRET=abcdefg...       # ← 27 characters
```

**Test connection:**
```typescript
// In server console or API test
import cloudinary from '@/lib/services/cloudinary.service';

cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connected'))
  .catch(err => console.error('❌ Cloudinary error:', err));
```

**2. Check rate limits:**
Login to Cloudinary Dashboard → Check usage:
- Free plan: 25 credits/month
- Each upload consumes credits

**3. Increase timeout:**
```typescript
cloudinary.config({
  upload_timeout: 120000, // 2 minutes
});
```

---

### ❌ Error: "Resource not found" on Cloudinary

**Symptom:**
Upload succeeds but URL returns 404

**Causes:**
1. Wrong resource_type (should be 'video' for audio)
2. File not fully processed yet
3. Public ID mismatch

**Solutions:**

**Verify resource type:**
```typescript
// MP3/WAV must use 'video'
await cloudinary.uploader.upload(dataUri, {
  resource_type: 'video', // ✅ Correct for audio
  // resource_type: 'auto',  // ❌ May fail for audio
});

// ZIP must use 'raw'
await cloudinary.uploader.upload(dataUri, {
  resource_type: 'raw', // ✅ Correct for ZIP
});
```

**Check Cloudinary console:**
1. Go to Media Library
2. Filter by resource type: "Video" (for MP3/WAV) or "Raw" (for ZIP)
3. Search for public_id: `{beatId}_mp3`

---

### ❌ Error: "Invalid signature"

**Symptom:**
```json
{ "error": "Invalid signature" }
```

**Causes:**
1. CLOUDINARY_API_SECRET incorrect
2. System clock out of sync
3. Using unsigned upload without preset

**Solutions:**
1. Verify API secret matches dashboard
2. Sync system time: `sudo ntpdate -s time.apple.com`
3. Ensure using signed upload (current implementation)

---

## 🔴 MongoDB Issues

### ❌ Error: "Beat non trouvé" (404)

**Symptom:**
```json
{ "error": "Beat non trouvé" }
```

**Causes:**
1. Beat ID invalid (not ObjectId format)
2. Beat deleted from DB
3. Wrong database connection

**Solutions:**

**Verify beat exists:**
```bash
mongo "mongodb://..."
use isma-files
db.beats.findOne({ _id: ObjectId("YOUR_BEAT_ID") })
```

**Check ObjectId format:**
```typescript
import mongoose from 'mongoose';

// ✅ Valid ObjectId
const isValid = mongoose.Types.ObjectId.isValid("65f1234567890abcdef12345");

// ❌ Invalid formats
"123"                    // Too short
"not-an-objectid"        // Wrong format
"65f1234567890abcdef"    // Too short (needs 24 hex chars)
```

---

### ❌ Error: "MongoServerError: buffering timed out"

**Symptom:**
Database operations hang then fail

**Causes:**
1. MongoDB not connected
2. Network issue
3. Connection string incorrect

**Solutions:**

**Test connection:**
```typescript
import connectDB from '@/lib/db/mongodb';

connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
```

**Verify connection string:**
```bash
# .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ismafiles?retryWrites=true&w=majority

# Common mistakes:
❌ Missing database name
❌ Wrong password (URL-encode special chars)
❌ IP not whitelisted (MongoDB Atlas)
```

---

## 🔴 Frontend Issues

### ❌ Drag & Drop not working

**Symptom:**
Files don't register when dropped

**Causes:**
1. Event.preventDefault() missing
2. Wrong event handlers
3. File input disabled

**Solutions:**

**Verify handlers:**
```typescript
// ✅ Correct implementation
onDragOver={(e) => {
  e.preventDefault();  // ← Essential!
  e.stopPropagation();
}}

onDrop={(e) => {
  e.preventDefault();  // ← Essential!
  e.stopPropagation();
  const files = e.dataTransfer.files;
  handleFile(files[0]);
}}

// ❌ Wrong: missing preventDefault
onDrop={(e) => {
  const files = e.dataTransfer.files; // Browser navigates to file!
}}
```

---

### ❌ Progress bar stuck at 0%

**Symptom:**
Upload starts but progress doesn't update

**Causes:**
1. State not updating
2. Interval not clearing
3. Using fetch() without progress tracking

**Solutions:**

**Current implementation uses simulation:**
```typescript
// Simulated progress (increments every 300ms)
const interval = setInterval(() => {
  setProgress(prev => Math.min(prev + 10, 90));
}, 300);

// Must clear interval after upload completes
clearInterval(interval);
```

**For real progress, use XMLHttpRequest:**
```typescript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  const percent = (e.loaded / e.total) * 100;
  setProgress(percent);
});
xhr.open('POST', '/api/beats/{id}/upload');
xhr.send(formData);
```

---

### ❌ Page redirects before seeing success

**Symptom:**
Success animation doesn't show

**Causes:**
1. Redirect too fast
2. Animation not awaited

**Solutions:**

**Add delay before redirect:**
```typescript
// Current implementation
setTimeout(() => {
  router.push('/admin/beats');
}, 1500); // ← 1.5s delay

// Increase if animation not visible
setTimeout(() => {
  router.push('/admin/beats');
}, 3000); // 3s delay
```

---

## 🔴 Network Issues

### ❌ Error: "413 Payload Too Large"

**Symptom:**
Upload fails for large files (even under limit)

**Causes:**
1. Next.js body size limit (default: 4MB)
2. Nginx/proxy limit
3. Cloudinary limit

**Solutions:**

**Increase Next.js limit:**
```javascript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '600mb', // Match largest file (stems)
    },
  },
}
```

**For Nginx:**
```nginx
client_max_body_size 600M;
```

**For Vercel deployment:**
Vercel has a 4.5MB limit for Hobby plan. Consider:
1. Upgrading to Pro ($20/month, 100MB limit)
2. Direct client → Cloudinary upload (skip Next.js)

---

### ❌ Error: "Network request failed"

**Symptom:**
Upload fails intermittently

**Causes:**
1. Slow/unstable network
2. File too large for timeout
3. Cloudinary server issues

**Solutions:**

**Increase timeout:**
```typescript
const response = await fetch('/api/beats/{id}/upload', {
  method: 'POST',
  body: formData,
  signal: AbortSignal.timeout(300000), // 5 minutes
});
```

**Add retry logic:**
```typescript
async function uploadWithRetry(formData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch('/api/beats/{id}/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000)); // Wait 2s
    }
  }
}
```

---

## 🔴 GSAP Animation Issues

### ❌ Error: "Cannot read property 'current' of null"

**Symptom:**
GSAP animations crash on mount

**Causes:**
1. Ref not attached yet
2. Animation runs before component mounts
3. Missing ref initialization

**Solutions:**

**Use useEffect with dependency:**
```typescript
const titleRef = useRef<HTMLHeadingElement>(null);

useEffect(() => {
  if (!titleRef.current) return; // ← Guard clause

  gsap.from(titleRef.current, {
    opacity: 0,
    duration: 0.8,
  });
}, []); // ← Empty deps = run once after mount
```

---

## 🔴 Build/Deployment Issues

### ❌ Error: "Module not found: Can't resolve '@/lib/...'"

**Symptom:**
TypeScript can't find imports

**Causes:**
1. Missing `tsconfig.json` paths
2. Wrong import alias

**Solutions:**

**Verify tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]  // ← Must exist
    }
  }
}
```

**Restart TypeScript server:**
- VSCode: `Cmd+Shift+P` → "Restart TS Server"
- Or restart IDE

---

### ❌ Build fails with "Type error"

**Symptom:**
```
Type error: Property 'files' does not exist on type 'IBeat'
```

**Causes:**
1. Type definitions out of sync
2. Missing type imports

**Solutions:**

**Verify types/index.ts:**
```typescript
export interface IBeat {
  // ...
  files: {
    mp3: string;
    wav: string;
    stems: string;
  };
  // ...
}
```

**Clear Next.js cache:**
```bash
rm -rf .next
npm run build
```

---

## 📞 Still having issues?

### Debug checklist:
1. [ ] Check browser console (F12)
2. [ ] Check Next.js server logs (terminal)
3. [ ] Check Cloudinary dashboard
4. [ ] Check MongoDB Atlas logs
5. [ ] Test with Postman/Insomnia
6. [ ] Check .env.local variables
7. [ ] Restart Next.js dev server

### Useful commands:
```bash
# Full reset
rm -rf .next node_modules
npm install
npm run dev

# Check environment
echo $CLOUDINARY_CLOUD_NAME
echo $MONGODB_URI

# Test API directly
curl -X POST localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"pwd"}'
```

---

**If all else fails, check:**
1. UPLOAD_SYSTEM_DOCS.md (detailed specs)
2. ARCHITECTURE.md (system design)
3. GitHub issues (if repository exists)

**Contact support with:**
- Full error message
- Browser console logs
- Server logs
- Steps to reproduce
