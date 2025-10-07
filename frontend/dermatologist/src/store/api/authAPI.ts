import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (dermatologist-specific key)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('dermatologist_token') ||
    localStorage.getItem('token'); // fallback if old key still present
  if (token) {
    const headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
    config.headers = headers;
  }
  return config;
});

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/login', credentials),
  
  logout: () =>
    api.post('/logout'),
  
  getMe: () =>
    api.get('/dermatologist/me'),
};
