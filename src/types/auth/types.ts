export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  kycStatus: string;
  avatarUrl: string | null;
  watchlist: string[];
  settings: {
    language: string;
    fiatCurrency: string;
    theme: string;
    priceAlerts: boolean;
    pushNotifications: boolean;
    biometricEnabled: boolean;
  };
  createdAt: string;
}

export interface UserResponse {
  data: User;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface AuthResponse {
  data: AuthPayload;
}

export interface OtpRequest {
  email: string;
}

export interface AuthOtp {
  message: string;
  demoCode: string;
  expiresInSeconds: number;
}

export interface OtpResponse {
  data: AuthOtp;
}

export interface OtpVerificationRequest {
  email: string;
  code: string;
}

export interface OtpVerificationPayload {
  verified: boolean;
}

export interface OtpVerificationResponse {
  data: OtpVerificationPayload;
}
