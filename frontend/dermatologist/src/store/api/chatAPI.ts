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

export const chatAPI = {
  getMessages: (appointmentId: number) =>
    api.get(`/dermatologist/appointments/${appointmentId}/messages`),
  
  sendMessage: (appointmentId: number, message: string, type: string = 'text', attachment?: File) => {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('type', type);
    if (attachment) {
      formData.append('attachment', attachment);
    }
    
    return api.post(`/dermatologist/appointments/${appointmentId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  markAsRead: (appointmentId: number) =>
    api.put(`/dermatologist/appointments/${appointmentId}/messages/read`),
};
