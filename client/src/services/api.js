import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // If unauthorized, do not break immediately unless on protected route
    }
    return Promise.reject(error);
  }
);

// ── Products / Menu ────────────────────────────────────────────────
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/categories');

// ── Gallery ────────────────────────────────────────────────────────
export const getGallery = (params) => api.get('/gallery', { params });
export const createGalleryItem = (payload) => api.post('/gallery', payload);
export const updateGalleryItem = (id, payload) => api.patch(`/gallery/${id}`, payload);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

// ── Orders ────────────────────────────────────────────────────────
export const createOrder = (payload) => api.post('/orders', payload);
export const getAllOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getUserOrders = () => api.get('/orders/me');
export const updateOrderStatus = (id, orderStatus) =>
  api.patch(`/orders/${id}/status`, { orderStatus });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// ── Pricing ───────────────────────────────────────────────────────
export const getPricing = () => api.get('/pricing');
export const updatePricing = (pricings) => api.put('/pricing', { pricings });

// ── Contact ───────────────────────────────────────────────────────
export const sendContactMessage = (payload) => api.post('/contact', payload);

// ── Auth ──────────────────────────────────────────────────────────
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/me', data);

export default api;
