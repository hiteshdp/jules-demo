import apiClient from './apiClient';
import { Appointment } from '../../types/appointment';

type AppointmentParams = {
  page?: number;
  status?: string;
  dermatologist_id?: number;
  patient_id?: number;
  date_from?: string;
  date_to?: string;
};

type FilterData<T> = {
    id: number;
    name: string;
} & T;

export const appointmentsAPI = {
  getAppointments: (params: AppointmentParams) => {
    return apiClient.get<{ data: { data: Appointment[]; total: number; per_page: number; current_page: number; last_page: number; from: number; to: number; } }>('/admin/appointments', { params });
  },
  getDermatologistsForFilter: () => {
    return apiClient.get<{ data: FilterData<{ specialization: string; }>[] }>('/admin/appointments/filters/dermatologists');
  },
  getPatientsForFilter: () => {
    return apiClient.get<{ data: FilterData<{ email: string; }>[] }>('/admin/appointments/filters/patients');
  }
};