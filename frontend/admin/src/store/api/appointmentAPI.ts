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

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const appointmentAPI = {
  getAppointments: (params?: any) =>
    api.get('/admin/appointments', { params }),
  getAppointmentDetails: (id: number) =>
    api.get(`/admin/appointments/${id}`),
  getAppointmentChat: (id: number) =>
    api.get(`/admin/appointments/${id}/chat`),
  updatePaymentStatus: (id: number, status: string) =>
    api.put(`/admin/appointments/${id}/payment-status`, { status }),
  getDermatologistsForFilter: () =>
    api.get('/admin/appointments/filters/dermatologists'),
  getPatientsForFilter: () =>
    api.get('/admin/appointments/filters/patients'),
};
