import axios from 'axios';

// Resolve base API URL reliably with automatic formatting
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'https://hisaab-app-4ojg.vercel.app/api';
  const clean = envUrl.trim().replace(/\/+$/, '');
  // Ensure the URL always ends with /api to match backend mount paths
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hisab_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized or expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or revoked
      localStorage.removeItem('hisab_token');
      localStorage.removeItem('hisab_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
