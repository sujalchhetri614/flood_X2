import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, UserRole } from '@/types/auth';
import { clearSession, getSession, seedDemoAuthority } from '@/services/auth';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  setSession: (session: AuthSession) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);

  useEffect(() => {
    seedDemoAuthority();
    setSessionState(getSession());
  }, []);

  const setSession = useCallback((next: AuthSession) => {
    setSessionState(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      role: session?.role ?? null,
      setSession,
      signOut,
    }),
    [session, setSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
