// Generated via prompt: prompts/admin_patients_crud_v1.md
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const patientAPI = {
    getPatients: (params: { page?: number; search?: string } = {}) =>
        api.get('/admin/patients', { params }),

    getPatient: (patientId: number) =>
        api.get(`/admin/patients/${patientId}`),

    createPatient: (data: { name: string; email: string; phone_no: string; password: string; dob?: string; gender?: 'male' | 'female' | 'other' }) =>
        api.post('/admin/patients', data),

    updatePatient: (patientId: number, data: Partial<{ name: string; email: string; phone_no: string; password: string; dob: string; gender: 'male' | 'female' | 'other' }>) =>
        api.put(`/admin/patients/${patientId}`, data),

    deletePatient: (patientId: number) =>
        api.delete(`/admin/patients/${patientId}`),
};
