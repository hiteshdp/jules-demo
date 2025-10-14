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

export interface ChatMessage {
  id: number;
  appointment_id: number;
  sender_id: number;
  message: string;
  attachment?: string;
  attachment_url?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'file';
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    role: string;
  };
}

export const chatAPI = {
  getMessages: (appointmentId: number, afterId?: number) =>
    api.get(`/dermatologist/appointments/${appointmentId}/chat${afterId ? `?after_id=${afterId}` : ''}`),
  
  sendMessage: (appointmentId: number, payload: { message?: string; file?: File }) => {
    const formData = new FormData();
    
    // Only append message if it's not empty
    if (payload.message && payload.message.trim()) {
      formData.append('message', payload.message);
    }
    
    // Add file if provided
    if (payload.file) {
      formData.append('attachment', payload.file);
    }
    
    return api.post(`/dermatologist/appointments/${appointmentId}/chat`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  markAsRead: (appointmentId: number) =>
    api.put(`/dermatologist/appointments/${appointmentId}/chat/read`),
};
