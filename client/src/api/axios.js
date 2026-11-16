import axios from 'axios';

// Base URL dynamically picks up VITE_API_URL in production or defaults to '/api' for Vite dev proxy
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach Authorization header if token exists in storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('labpartner_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage if session expired while on protected route
      const isAuthRoute =
        window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register') ||
        window.location.pathname === '/';

      if (!isAuthRoute) {
        localStorage.removeItem('labpartner_token');
        localStorage.removeItem('labpartner_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
