export interface LoginRequest {
  loginType: 'email' | 'phone';
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerificationLimits {
  depositPerTransactionUsd: number;
  tradePerTransactionUsd: number;
  withdrawalPerTransactionUsd: number;
  dailyWithdrawalUsd: number;
}

export interface UserVerification {
  status: string;
  tier: string;
  level: number;
  label: string;
  limits: VerificationLimits;
  canTrade: boolean;
  canWithdraw: boolean;
  canUseSandboxDeposits: boolean;
}

export interface UserSettings {
  language: string;
  fiatCurrency: string;
  theme: string;
  pushNotifications: boolean;
  biometricEnabled: boolean;
}

export interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  twoFactorEnabled: boolean;
  kycStatus: 'approved' | 'not_started';
  verification: UserVerification;
  avatarUrl: string | null;
  watchlist: string[];
  settings: UserSettings;
  createdAt: string;
}

export interface UserResponse {
  data: User;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface LoginPayload extends AuthPayload {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: string;
  expiresInSeconds: number;
  refreshTokenExpiresAt: string;
}

export interface TwoFactorChallenge {
  requiresTwoFactor: true;
  challengeId: string;
  attemptsRemaining: number;
  expiresAt: string;
}

export type LoginResult = LoginPayload | TwoFactorChallenge;

export interface LoginResponse {
  data: LoginResult;
}

export interface OtpRouting {
  requestPath: string;
  verifyPath: string;
  expiresInSeconds: number;
}

export interface RegisterPayload {
  user: User;
  emailVerificationRequired: boolean;
  nextStep: string;
  otp: OtpRouting;
}

export interface RegisterResponse {
  data: RegisterPayload;
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

export interface OtpVerificationPayload extends Omit<LoginPayload, 'user'> {
  verified: boolean;
  user: Pick<
    User,
    'id' | 'role' | 'fullName' | 'email' | 'emailVerified' | 'phone'
  >;
}

export interface OtpVerificationResponse {
  data: OtpVerificationPayload;
}

// 2FA setup

export interface TwoFactorSetupPayload {
  secret: string;
  otpauthUri: string;
  enabled: boolean;
}

export interface TwoFactorSetupResponse {
  data: TwoFactorSetupPayload;
}

// 2FA enable

export interface TwoFactorEnableRequest {
  code: string;
}

export interface TwoFactorEnablePayload {
  enabled: boolean;
  recoveryCodes: string[];
  recoveryCodeCount: number;
}

// 2FA verify (post-login challenge)

export interface TwoFactorVerifyRequest {
  challengeId: string;
  code?: string;
  recoveryCode?: string;
}

export interface TwoFactorVerifyResponse {
  data: LoginPayload;
}

export interface TwoFactorEnableResponse {
  data: TwoFactorEnablePayload;
}

export interface SettingDetails {
  language: string;
  fiatCurrency: string;
  theme: string;
  priceAlerts: boolean;
  pushNotifications: true;
  biometricEnabled: false;
}

export interface SettingsResponse {
  data: SettingDetails;
}

// Validating details

export interface ValidationRequest {
  email?: string;
  phone?: string;
}

interface ValidationEmailDetails {
  value: string;
  normalized: string;
  valid: boolean;
  available: boolean;
  code: string;
  message: string;
}

interface ValidationPhoneDetails {
  value: string;
  normalized: string;
  valid: boolean;
  available: boolean;
  code: string;
  message: string;
}

export interface ValidationDetails {
  email: ValidationEmailDetails;
  phone: ValidationPhoneDetails;
  canRegister: boolean;
}

export interface ValidationResponse {
  data: ValidationDetails;
}
