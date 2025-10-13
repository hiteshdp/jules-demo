import apiClient from './apiClient';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/login', data),

  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    apiClient.post('/register', data),

  getMe: () =>
    apiClient.get('/me'),

  logout: () =>
    apiClient.post('/logout'),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post('/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post('/reset-password', data),
};

export default authAPI;