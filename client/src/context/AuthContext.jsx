import { createContext, useContext } from 'react';
import { useAuthController } from '../controllers/useAuthController';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthController();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
