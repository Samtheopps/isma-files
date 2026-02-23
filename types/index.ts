// Global Types and Interfaces

export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  purchases: string[]; // Order IDs
}

export interface IBeat {
  _id: string;
  title: string;
  bpm: number;
  key: string;
  genre: string[];
  mood: string[];
  tags: string[];
  previewUrl: string; // 30-60sec preview URL
  coverImage: string;
  waveformData: WaveformData;
  files: BeatFiles;
  licenses: License[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  salesCount: number;
}

export interface WaveformData {
  peaks: number[];
  duration: number;
}

export interface BeatFiles {
  mp3: string; // Full MP3 URL
  wav: string; // Full WAV URL
  stems: string; // Stems ZIP URL
}

export interface License {
  type: LicenseType;
  price: number;
  available: boolean;
  features: LicenseFeatures;
}

export type LicenseType = 'basic' | 'standard' | 'pro' | 'unlimited' | 'exclusive';

export interface LicenseFeatures {
  mp3: boolean;
  wav: boolean;
  stems: boolean;
  streams: number; // -1 = unlimited
  physicalSales: number; // -1 = unlimited
  exclusivity: boolean;
}

export interface IOrder {
  _id: string;
  orderNumber: string; // "ORD-20260211-XXXX"
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  stripePaymentId: string;
  stripeSessionId?: string;
  status: OrderStatus;
  licenseContract: string; // PDF URL
  deliveryEmail: string;
  isGuestOrder: boolean;
  guestEmail?: string;
  downloadToken?: string;
  downloadCount: number;
  downloadExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  beatId: string;
  beatTitle: string;
  licenseType: LicenseType;
  price: number;
}

export interface IDownload {
  _id: string;
  orderId: string;
  userId: string;
  beatId: string;
  licenseType: LicenseType;
  downloadCount: number;
  maxDownloads?: number; // Optionnel - Téléchargements illimités par défaut
  expiresAt: Date; // 30 days after purchase
  files: DownloadFiles;
  createdAt: Date;
  updatedAt: Date;
}

export interface DownloadFiles {
  mp3?: string;
  wav?: string;
  stems?: string;
  contract: string; // License PDF
}

// Cart Types
export interface CartItem {
  beatId: string;
  beat: IBeat;
  licenseType: LicenseType;
  price: number;
}

// Filter Types
export interface BeatFilters {
  genre?: string[];
  mood?: string[];
  bpmMin?: number;
  bpmMax?: number;
  key?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
