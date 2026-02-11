import mongoose, { Schema, Document } from 'mongoose';
import { LicenseType, OrderStatus } from '@/types';

export interface IOrderDocument extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: {
    beatId: mongoose.Types.ObjectId;
    beatTitle: string;
    licenseType: LicenseType;
    price: number;
  }[];
  totalAmount: number;
  stripePaymentId: string;
  stripeSessionId?: string;
  status: OrderStatus;
  licenseContract: string;
  deliveryEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        beatId: {
          type: Schema.Types.ObjectId,
          ref: 'Beat',
          required: true,
        },
        beatTitle: {
          type: String,
          required: true,
        },
        licenseType: {
          type: String,
          enum: ['basic', 'standard', 'pro', 'unlimited', 'exclusive'],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripePaymentId: {
      type: String,
      required: true,
    },
    stripeSessionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    licenseContract: {
      type: String,
      default: '',
    },
    deliveryEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  next();
});

// Index for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
