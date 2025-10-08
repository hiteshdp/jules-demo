import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (dermatologist-specific key, fallback to generic)
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('dermatologist_token') ||
    localStorage.getItem('token');
  if (token) {
    const headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    } as any;
    config.headers = headers;
  }
  return config;
});

export const chatAPI = {
  getMessages: (appointmentId: number, afterId?: number) =>
    api.get(`/dermatologist/appointments/${appointmentId}/chat${afterId ? `?after_id=${afterId}` : ''}`),
  
  sendMessage: (appointmentId: number, message: string, type: string = 'text', attachment?: File) => {
    const payload = {
      message,
      type,
      attachment: attachment ? attachment.name : undefined
    };
    
    return api.post(`/dermatologist/appointments/${appointmentId}/chat`, payload);
  },
  
  markAsRead: (appointmentId: number) =>
    api.put(`/dermatologist/appointments/${appointmentId}/chat/read`),
};
