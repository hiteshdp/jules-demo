import apiClient from './apiClient';
import { Dermatologist } from '../../types/dermatologist';

export type DermatologistPayload = Omit<Dermatologist, 'id' | 'created_at'> & { password?: string };

export const dermatologistAPI = {
    getDermatologists: (params: { page?: number; per_page?: number; search?: string } = {}) =>
        apiClient.get('/admin/dermatologists', { params }),

    getDermatologist: (dermatologistId: number) =>
        apiClient.get(`/admin/dermatologists/${dermatologistId}`),

    createDermatologist: (data: DermatologistPayload) =>
        apiClient.post('/admin/dermatologists', data),

    updateDermatologist: (dermatologistId: number, data: Partial<DermatologistPayload>) =>
        apiClient.put(`/admin/dermatologists/${dermatologistId}`, data),

    deleteDermatologist: (dermatologistId: number) =>
        apiClient.delete(`/admin/dermatologists/${dermatologistId}`),
};