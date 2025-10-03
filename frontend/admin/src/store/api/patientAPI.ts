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

export const patientAPI = {
  getPatients: (params: { page?: number; search?: string } = {}) =>
    api.get('/admin/patients', { params }),
  
  getPatient: (patientId: number) =>
    api.get(`/admin/patients/${patientId}`),
  
  updatePatientStatus: (patientId: number, data: { is_active: boolean }) =>
    api.put(`/admin/patients/${patientId}/status`, data),
};
