import axios from 'axios';

// Central Axios instance. Point VITE_API_BASE_URL at the real backend
// once it's available; every request/response passes through here.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach auth token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common error cases in one place
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
