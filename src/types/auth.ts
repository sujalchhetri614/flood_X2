export type UserRole = 'citizen' | 'authority';

export interface CitizenAccount {
  phone: string;
  passwordHash: string;
  createdAt: number;
}

export interface AuthorityAccount {
  identifier: string;
  passwordHash: string;
  createdAt: number;
}

export interface AuthSession {
  role: UserRole;
  identifier: string;
  token: string;
  expiresAt: number;
}

export type AuthErrorCode =
  | 'PHONE_INVALID'
  | 'PHONE_NOT_REGISTERED'
  | 'PHONE_ALREADY_REGISTERED'
  | 'PASSWORD_INVALID'
  | 'PASSWORD_MISMATCH'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'CREDENTIALS_INVALID'
  | 'NOT_FOUND'
  | 'UNKNOWN';

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  PHONE_INVALID: 'Please enter a valid 10-digit mobile number.',
  PHONE_NOT_REGISTERED: 'No account found for this mobile number.',
  PHONE_ALREADY_REGISTERED: 'An account with this mobile number already exists.',
  PASSWORD_INVALID: 'Password must contain at least 8 characters, one uppercase letter, and one number.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  OTP_INVALID: 'Invalid OTP. Please try again.',
  OTP_EXPIRED: 'This OTP has expired. Please request a new one.',
  CREDENTIALS_INVALID: 'Invalid credentials. Please check your details and try again.',
  NOT_FOUND: 'No account found with these details.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

export interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: number;
  consumed: boolean;
}
