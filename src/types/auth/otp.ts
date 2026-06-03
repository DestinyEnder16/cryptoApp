import type { LoginPayload } from './types';

export interface OtpRouting {
  requestPath: string;
  verifyPath: string;
  expiresInSeconds: number;
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

export interface OtpVerificationPayload extends LoginPayload {
  verified: boolean;
}

export interface OtpVerificationResponse {
  data: OtpVerificationPayload;
}
