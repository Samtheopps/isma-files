import mongoose, { Schema, Document } from 'mongoose';
import { LicenseType } from '@/types';

export interface IDownloadDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  beatId: mongoose.Types.ObjectId;
  licenseType: LicenseType;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: Date;
  files: {
    mp3?: string;
    wav?: string;
    stems?: string;
    contract: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DownloadSchema = new Schema<IDownloadDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    beatId: {
      type: Schema.Types.ObjectId,
      ref: 'Beat',
      required: true,
    },
    licenseType: {
      type: String,
      enum: ['basic', 'standard', 'pro', 'unlimited', 'exclusive'],
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    maxDownloads: {
      type: Number,
      default: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    files: {
      mp3: String,
      wav: String,
      stems: String,
      contract: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Set expiration date before saving (30 days from creation)
DownloadSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
    this.expiresAt = expiryDate;
  }
  next();
});

// Index for cleanup and queries
DownloadSchema.index({ userId: 1, createdAt: -1 });
DownloadSchema.index({ expiresAt: 1 });
DownloadSchema.index({ orderId: 1 });

export default mongoose.models.Download || mongoose.model<IDownloadDocument>('Download', DownloadSchema);
