import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const settingsAPI = {
  getSettings: () =>
    api.get('/admin/settings'),

  updateSettings: (data: Record<string, any>) => {
    // Convert object to array format expected by backend
    const settingsArray = Object.entries(data).map(([key, value]) => ({
      key,
      value: String(value),
      type: typeof value === 'number' ? 'number' :
        typeof value === 'boolean' ? 'boolean' : 'string'
    }));

    return api.put('/admin/settings', { settings: settingsArray });
  },
};
