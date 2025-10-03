import apiClient from './apiClient';

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/login', credentials),
  
  register: (userData: any) =>
    apiClient.post('/register', userData),
  
  logout: () =>
    apiClient.post('/logout'),
  
  getMe: () =>
    apiClient.get('/me'),
};
