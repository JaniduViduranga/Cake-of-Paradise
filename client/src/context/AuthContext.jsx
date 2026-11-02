import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  // Synchronize Axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // On initial mount, restore session from localStorage and verify with backend
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('auth_user');
          }
        }

        try {
          // Verify with /api/auth/me to fetch fresh user profile
          const res = await authService.getCurrentUser();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('auth_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session verification failed, logging out:', error?.response?.data?.message || error.message);
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // Login handler: stores token & user in localStorage and state
  const login = useCallback((userData, authToken) => {
    if (!userData) return;

    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));

    if (authToken) {
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }

    setIsLoginOpen(false);
  }, []);

  // Logout handler: clears session and state
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    authService.logout();
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // Profile update handler
  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.name && !updates.fullName) {
        updated.fullName = updates.name;
      }
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!user,
    isLoginOpen,
    setIsLoginOpen,
    redirectPath,
    setRedirectPath,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
