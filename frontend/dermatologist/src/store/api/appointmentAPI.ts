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

export const appointmentAPI = {
  getAppointments: () =>
    api.get('/dermatologist/appointments'),
  
  getAppointment: (appointmentId: number) =>
    api.get(`/dermatologist/appointments/${appointmentId}`),
  
  updateAppointmentStatus: (appointmentId: number, data: any) =>
    api.put(`/dermatologist/appointments/${appointmentId}/status`, data),
  
  sendMessage: (appointmentId: number, data: any) =>
    api.post(`/dermatologist/appointments/${appointmentId}/messages`, data),
  
  getChatMessages: (appointmentId: number) =>
    api.get(`/dermatologist/appointments/${appointmentId}/messages`),
  
  markMessagesAsRead: (appointmentId: number) =>
    api.put(`/dermatologist/appointments/${appointmentId}/messages/read`),
  
  getPaymentHistory: () =>
    api.get('/dermatologist/payments'),
};
