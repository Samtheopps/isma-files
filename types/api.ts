// API Request & Response Types

import { IUser, IBeat, IOrder, IDownload, LicenseType, OrderStatus } from './index';

// Auth
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: Omit<IUser, 'password'>;
  token: string;
}

// Beats
export interface CreateBeatRequest {
  title: string;
  bpm: number;
  key: string;
  genre: string[];
  mood: string[];
  tags: string[];
  licenses: {
    type: LicenseType;
    price: number;
  }[];
}

export interface UpdateBeatRequest extends Partial<CreateBeatRequest> {
  isActive?: boolean;
}

export interface BeatsResponse {
  success: boolean;
  beats: IBeat[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BeatResponse {
  success: boolean;
  beat: IBeat;
}

// Orders
export interface CheckoutRequest {
  items: {
    beatId: string;
    licenseType: LicenseType;
  }[];
  email: string;
}

export interface CheckoutResponse {
  success: boolean;
  sessionId: string;
  url: string;
}

export interface OrderResponse {
  success: boolean;
  order: IOrder;
}

export interface OrdersResponse {
  success: boolean;
  orders: IOrder[];
}

// Downloads
export interface DownloadResponse {
  success: boolean;
  download: IDownload;
}

export interface DownloadLinkResponse {
  success: boolean;
  downloadUrl: string;
  expiresIn: number; // seconds
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error Response
export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}
