import mongoose, { Schema, Document } from 'mongoose';
import { LicenseType } from '@/types';

export interface IBeatDocument extends Document {
  title: string;
  bpm: number;
  key: string;
  genre: string[];
  mood: string[];
  tags: string[];
  previewUrl: string;
  coverImage: string;
  waveformData: {
    peaks: number[];
    duration: number;
  };
  files: {
    mp3: string;
    wav: string;
    stems: string;
  };
  licenses: {
    type: LicenseType;
    price: number;
    available: boolean;
    features: {
      mp3: boolean;
      wav: boolean;
      stems: boolean;
      streams: number;
      physicalSales: number;
      exclusivity: boolean;
    };
  }[];
  isActive: boolean;
  playCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BeatSchema = new Schema<IBeatDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    bpm: {
      type: Number,
      required: [true, 'BPM is required'],
      min: [60, 'BPM must be at least 60'],
      max: [200, 'BPM must be at most 200'],
    },
    key: {
      type: String,
      required: [true, 'Key is required'],
    },
    genre: {
      type: [String],
      required: true,
    },
    mood: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    previewUrl: {
      type: String,
      required: [true, 'Preview URL is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    waveformData: {
      peaks: {
        type: [Number],
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
    },
    files: {
      mp3: {
        type: String,
        required: true,
      },
      wav: {
        type: String,
        required: true,
      },
      stems: {
        type: String,
        required: true,
      },
    },
    licenses: [
      {
        type: {
          type: String,
          enum: ['basic', 'standard', 'pro', 'unlimited', 'exclusive'],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        available: {
          type: Boolean,
          default: true,
        },
        features: {
          mp3: {
            type: Boolean,
            default: true,
          },
          wav: {
            type: Boolean,
            default: false,
          },
          stems: {
            type: Boolean,
            default: false,
          },
          streams: {
            type: Number,
            default: -1, // -1 = unlimited
          },
          physicalSales: {
            type: Number,
            default: -1,
          },
          exclusivity: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    playCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
BeatSchema.index({ title: 'text', tags: 'text' });
BeatSchema.index({ genre: 1 });
BeatSchema.index({ bpm: 1 });
BeatSchema.index({ createdAt: -1 });

export default mongoose.models.Beat || mongoose.model<IBeatDocument>('Beat', BeatSchema);
