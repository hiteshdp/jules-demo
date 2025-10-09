import apiClient from './apiClient';

export const appointmentAPI = {
  getAppointments: () =>
    apiClient.get('/patient/appointments'),
  
  getDermatologists: () =>
    apiClient.get('/patient/dermatologists'),
  
  bookAppointment: (data: { dermatologist_id: number; scheduled_at: string }) =>
    apiClient.post('/patient/appointments', data),

  // Payment related APIs
  createAppointmentPayment: (data: { dermatologist_id: number; scheduled_at: string }) =>
    apiClient.post('/patient/appointment/payment/create', data),

  verifyAppointmentPayment: (data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    payment_id: number;
  }) =>
    apiClient.post('/patient/appointment/payment/verify', data),
};
