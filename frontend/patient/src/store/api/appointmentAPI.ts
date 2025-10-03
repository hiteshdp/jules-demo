import apiClient from './apiClient';

export const appointmentAPI = {
  getAppointments: () =>
    apiClient.get('/patient/appointments'),
  
  getDermatologists: () =>
    apiClient.get('/patient/dermatologists'),
  
  bookAppointment: (data: { dermatologist_id: number; scheduled_at: string }) =>
    apiClient.post('/patient/appointments', data),
};
