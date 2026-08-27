import { useState, useCallback } from 'react';
import { MOCK_USER } from '../models/user';

/**
 * Controller managing Authentication state, login, registration, and profile updates
 */
export function useAuthController() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const login = useCallback((credentials) => {
    if (credentials.email && credentials.password) {
      setUser(MOCK_USER);
      setIsLoginOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const register = useCallback((data) => {
    const newUser = { ...MOCK_USER, ...data, id: 'usr_new', orders: [], activeOrder: null };
    setUser(newUser);
    setIsLoginOpen(false);
    return { success: true };
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isLoginOpen,
    setIsLoginOpen,
    login,
    logout,
    updateProfile,
    register,
  };
}
