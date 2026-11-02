import api from './api';

/**
 * Register a new user
 * @param {Object} userData - { fullName, email, phone, password }
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Fetch authenticated user profile using active token
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Clear local session tokens
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
};

