import { createContext, useContext, useState, type ReactNode } from 'react';

export type Mode = 'sign-in' | 'sign-up';

type AuthModeContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
};

const AuthModeContext = createContext<AuthModeContextValue | null>(null);

export function AuthModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('sign-in');

  return (
    <AuthModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AuthModeContext.Provider>
  );
}

export function useAuthMode() {
  const ctx = useContext(AuthModeContext);
  if (!ctx) {
    throw new Error('useAuthMode must be used inside AuthModeProvider');
  }
  return ctx;
}
