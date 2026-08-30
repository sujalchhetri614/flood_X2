/**
 * Mock authentication service for FLOOD-X.
 *
 * This module is intentionally framework-agnostic and side-effect-free apart
 * from localStorage persistence. It exposes a small, typed surface so a real
 * backend (FastAPI + JWT + SMS/OTP) can later replace the mock implementation
 * without touching UI components.
 *
 * No real SMS is sent. OTPs are generated and returned for development only.
 */

import type {
  AuthSession,
  AuthorityAccount,
  CitizenAccount,
  OtpRecord,
} from '@/types/auth';
import { AuthError, AUTH_ERROR_MESSAGES } from '@/types/auth';

const STORAGE_KEY = 'floodx:auth';
const SESSION_KEY = 'floodx:session';
const OTP_TTL_MS = 5 * 60 * 1000;
const MOCK_OTP = '123456';

const LATENCY_MS = 600;

interface Store {
  citizens: Record<string, CitizenAccount>;
  authorities: Record<string, AuthorityAccount>;
  otps: Record<string, OtpRecord>;
}

function loadStore(): Store {
  if (typeof localStorage === 'undefined') {
    return { citizens: {}, authorities: {}, otps: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { citizens: {}, authorities: {}, otps: {} };
    return JSON.parse(raw) as Store;
  } catch {
    return { citizens: {}, authorities: {}, otps: {} };
  }
}

function saveStore(store: Store): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function fail(code: keyof typeof AUTH_ERROR_MESSAGES, ms = LATENCY_MS): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new AuthError(code, AUTH_ERROR_MESSAGES[code])), ms),
  );
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/\s/g, ''));
}

export function validatePassword(password: string): boolean {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function hashPassword(password: string): string {
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0;
  }
  return `h_${h}`;
}

function issueOtp(store: Store, phone: string): OtpRecord {
  const record: OtpRecord = {
    phone,
    code: MOCK_OTP,
    expiresAt: Date.now() + OTP_TTL_MS,
    consumed: false,
  };
  store.otps[phone] = record;
  saveStore(store);
  return record;
}

export interface SendOtpResult {
  phone: string;
  devCode: string;
}

export async function sendCitizenOtp(phone: string): Promise<SendOtpResult> {
  if (!validatePhone(phone)) return fail('PHONE_INVALID');
  const store = loadStore();
  if (store.citizens[phone]) return fail('PHONE_ALREADY_REGISTERED');
  const record = issueOtp(store, phone);
  return delay({ phone, devCode: record.code });
}

export async function sendForgotOtp(phone: string): Promise<SendOtpResult> {
  if (!validatePhone(phone)) return fail('PHONE_INVALID');
  const store = loadStore();
  if (!store.citizens[phone]) return fail('PHONE_NOT_REGISTERED');
  const record = issueOtp(store, phone);
  return delay({ phone, devCode: record.code });
}

export async function sendAuthorityOtp(identifier: string): Promise<SendOtpResult> {
  const key = identifier.trim().toLowerCase();
  if (!key) return fail('CREDENTIALS_INVALID');
  const store = loadStore();
  if (!store.authorities[key]) return fail('NOT_FOUND');
  const record = issueOtp(store, key);
  return delay({ phone: key, devCode: record.code });
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const store = loadStore();
  const record = store.otps[phone];
  if (!record || record.consumed) return fail('OTP_INVALID');
  if (Date.now() > record.expiresAt) return fail('OTP_EXPIRED');
  if (code !== record.code) return fail('OTP_INVALID');
  record.consumed = true;
  saveStore(store);
  return delay(true);
}

export async function createCitizenAccount(phone: string, password: string): Promise<void> {
  if (!validatePassword(password)) return fail('PASSWORD_INVALID');
  const store = loadStore();
  if (store.citizens[phone]) return fail('PHONE_ALREADY_REGISTERED');
  store.citizens[phone] = { phone, passwordHash: hashPassword(password), createdAt: Date.now() };
  saveStore(store);
  return delay(undefined);
}

export async function resetCitizenPassword(phone: string, password: string): Promise<void> {
  if (!validatePassword(password)) return fail('PASSWORD_INVALID');
  const store = loadStore();
  if (!store.citizens[phone]) return fail('PHONE_NOT_REGISTERED');
  store.citizens[phone] = { ...store.citizens[phone], passwordHash: hashPassword(password) };
  saveStore(store);
  return delay(undefined);
}

export async function loginCitizen(phone: string, password: string): Promise<AuthSession> {
  if (!validatePhone(phone)) return fail('PHONE_INVALID');
  const store = loadStore();
  const account = store.citizens[phone];
  if (!account || account.passwordHash !== hashPassword(password)) {
    return fail('CREDENTIALS_INVALID');
  }
  return delay(createSession('citizen', phone));
}

export async function loginAuthority(identifier: string, password: string): Promise<AuthSession> {
  const key = identifier.trim().toLowerCase();
  if (!key || !password) return fail('CREDENTIALS_INVALID');
  const store = loadStore();
  const account = store.authorities[key];
  if (!account || account.passwordHash !== hashPassword(password)) {
    return fail('CREDENTIALS_INVALID');
  }
  return delay(createSession('authority', key));
}

export async function resetAuthorityPassword(identifier: string, password: string): Promise<void> {
  if (!validatePassword(password)) return fail('PASSWORD_INVALID');
  const key = identifier.trim().toLowerCase();
  const store = loadStore();
  if (!store.authorities[key]) return fail('NOT_FOUND');
  store.authorities[key] = { ...store.authorities[key], passwordHash: hashPassword(password) };
  saveStore(store);
  return delay(undefined);
}

export function createSession(role: 'citizen' | 'authority', identifier: string): AuthSession {
  const session: AuthSession = {
    role,
    identifier,
    token: `mock_${role}_${identifier}_${Date.now()}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function getSession(): AuthSession | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

/** Seed a demo authority account so the authority login flow is testable. */
export function seedDemoAuthority(): void {
  const store = loadStore();
  const key = 'admin@floodx.gov';
  if (!store.authorities[key]) {
    store.authorities[key] = {
      identifier: key,
      passwordHash: hashPassword('FloodX2026'),
      createdAt: Date.now(),
    };
    saveStore(store);
  }
}
