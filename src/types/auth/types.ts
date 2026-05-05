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

export interface AuthPayload {
  user: User;
  token: string;
}

export interface AuthResponse {
  data: AuthPayload;
}
