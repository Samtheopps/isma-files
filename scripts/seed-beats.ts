import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI not found in .env.local');
}

// Schema Beat simplifié pour le seeding
const beatSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  bpm: { type: Number, required: true },
  key: { type: String, required: true },
  genre: [{ type: String }],
  mood: [{ type: String }],
  tags: [{ type: String }],
  previewUrl: { type: String, required: true },
  coverImage: { type: String, required: true },
  waveformData: {
    peaks: [{ type: Number }],
    duration: { type: Number },
  },
  files: {
    mp3: { type: String, required: true },
    wav: { type: String, required: true },
    stems: { type: String, required: true },
  },
  licenses: [{
    type: { type: String, enum: ['basic', 'standard', 'pro', 'exclusive'] },
    price: { type: Number },
    available: { type: Boolean },
    features: {
      mp3: { type: Boolean },
      wav: { type: Boolean },
      stems: { type: Boolean },
      streams: { type: Number },
      physicalSales: { type: Number },
      exclusivity: { type: Boolean },
    },
  }],
  plays: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Beat = mongoose.models.Beat || mongoose.model('Beat', beatSchema);

const beats = [
  {
    title: 'Dark Trap Energy',
    slug: 'dark-trap-energy',
    bpm: 140,
    key: 'C#m',
    genre: ['Trap', 'Dark'],
    mood: ['Dark', 'Energetic', 'Aggressive'],
    tags: ['808', 'hard', 'club'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 180 },
    files: {
      mp3: 'cloudinary://beats/dark-trap-energy.mp3',
      wav: 'cloudinary://beats/dark-trap-energy.wav',
      stems: 'cloudinary://beats/dark-trap-energy-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Melodic Drill Type Beat',
    slug: 'melodic-drill-type-beat',
    bpm: 145,
    key: 'Am',
    genre: ['Drill', 'Hip-Hop'],
    mood: ['Melodic', 'Dark'],
    tags: ['uk drill', 'piano', 'melodic'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 165 },
    files: {
      mp3: 'cloudinary://beats/melodic-drill.mp3',
      wav: 'cloudinary://beats/melodic-drill.wav',
      stems: 'cloudinary://beats/melodic-drill-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Afrobeat Summer Vibes',
    slug: 'afrobeat-summer-vibes',
    bpm: 128,
    key: 'F',
    genre: ['Afro', 'Pop'],
    mood: ['Chill', 'Energetic'],
    tags: ['afrobeat', 'dancehall', 'summer'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 195 },
    files: {
      mp3: 'cloudinary://beats/afrobeat-summer.mp3',
      wav: 'cloudinary://beats/afrobeat-summer.wav',
      stems: 'cloudinary://beats/afrobeat-summer-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Boom Bap Classic',
    slug: 'boom-bap-classic',
    bpm: 90,
    key: 'Dm',
    genre: ['Boom Bap', 'Hip-Hop'],
    mood: ['Chill', 'Melodic'],
    tags: ['90s', 'jazz', 'vinyl'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 200 },
    files: {
      mp3: 'cloudinary://beats/boom-bap-classic.mp3',
      wav: 'cloudinary://beats/boom-bap-classic.wav',
      stems: 'cloudinary://beats/boom-bap-classic-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'R&B Smooth Night',
    slug: 'rnb-smooth-night',
    bpm: 75,
    key: 'G',
    genre: ['R&B', 'Pop'],
    mood: ['Chill', 'Melodic'],
    tags: ['smooth', 'romantic', 'vocals'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 210 },
    files: {
      mp3: 'cloudinary://beats/rnb-smooth.mp3',
      wav: 'cloudinary://beats/rnb-smooth.wav',
      stems: 'cloudinary://beats/rnb-smooth-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 3900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 5900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 11900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Aggressive Trap Banger',
    slug: 'aggressive-trap-banger',
    bpm: 155,
    key: 'Em',
    genre: ['Trap', 'Hip-Hop'],
    mood: ['Aggressive', 'Energetic'],
    tags: ['hard', '808', 'club banger'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 175 },
    files: {
      mp3: 'cloudinary://beats/aggressive-trap.mp3',
      wav: 'cloudinary://beats/aggressive-trap.wav',
      stems: 'cloudinary://beats/aggressive-trap-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Chill Lo-Fi Study Beat',
    slug: 'chill-lofi-study-beat',
    bpm: 85,
    key: 'C',
    genre: ['Hip-Hop', 'Chill'],
    mood: ['Chill', 'Melodic'],
    tags: ['lofi', 'study', 'relax'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 190 },
    files: {
      mp3: 'cloudinary://beats/lofi-study.mp3',
      wav: 'cloudinary://beats/lofi-study.wav',
      stems: 'cloudinary://beats/lofi-study-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 1900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 3900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 7900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Sad Piano Emotional',
    slug: 'sad-piano-emotional',
    bpm: 70,
    key: 'Fm',
    genre: ['Rap', 'Pop'],
    mood: ['Sad', 'Melodic'],
    tags: ['piano', 'emotional', 'heartbreak'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 185 },
    files: {
      mp3: 'cloudinary://beats/sad-piano.mp3',
      wav: 'cloudinary://beats/sad-piano.wav',
      stems: 'cloudinary://beats/sad-piano-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Upbeat Pop Anthem',
    slug: 'upbeat-pop-anthem',
    bpm: 120,
    key: 'D',
    genre: ['Pop', 'Hip-Hop'],
    mood: ['Energetic', 'Melodic'],
    tags: ['pop', 'catchy', 'radio'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 195 },
    files: {
      mp3: 'cloudinary://beats/upbeat-pop.mp3',
      wav: 'cloudinary://beats/upbeat-pop.wav',
      stems: 'cloudinary://beats/upbeat-pop-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 3900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 5900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 11900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
  {
    title: 'Street Rap Hard Beat',
    slug: 'street-rap-hard-beat',
    bpm: 95,
    key: 'Gm',
    genre: ['Rap', 'Hip-Hop'],
    mood: ['Dark', 'Aggressive'],
    tags: ['street', 'gangsta', 'hard'],
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    waveformData: { peaks: Array(100).fill(0).map(() => Math.random()), duration: 170 },
    files: {
      mp3: 'cloudinary://beats/street-rap.mp3',
      wav: 'cloudinary://beats/street-rap.wav',
      stems: 'cloudinary://beats/street-rap-stems.zip',
    },
    licenses: [
      {
        type: 'basic',
        price: 2900,
        available: true,
        features: { mp3: true, wav: false, stems: false, streams: 10000, physicalSales: 500, exclusivity: false },
      },
      {
        type: 'standard',
        price: 4900,
        available: true,
        features: { mp3: true, wav: true, stems: false, streams: 50000, physicalSales: 2000, exclusivity: false },
      },
      {
        type: 'pro',
        price: 9900,
        available: true,
        features: { mp3: true, wav: true, stems: true, streams: -1, physicalSales: -1, exclusivity: false },
      },
    ],
    plays: Math.floor(Math.random() * 5000) + 1000,
    downloads: Math.floor(Math.random() * 500) + 50,
    isActive: true,
  },
];

async function seedBeats() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    console.log('🗑️  Suppression des anciens beats...');
    await Beat.deleteMany({});
    console.log('✅ Anciens beats supprimés');

    console.log('📝 Insertion de 10 beats...');
    const insertedBeats = await Beat.insertMany(beats);
    console.log(`✅ ${insertedBeats.length} beats insérés avec succès`);

    console.log('\n📊 Récapitulatif des beats créés:');
    insertedBeats.forEach((beat, index) => {
      console.log(`${index + 1}. ${beat.title} (${beat.bpm} BPM - ${beat.key}) - ${beat.genre.join(', ')}`);
    });

    console.log('\n✅ Seeding terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le seeding
seedBeats()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
