// Generated via prompt: prompts/dermatologist_fetch_functionality_v1.md
import apiClient from './apiClient';

export interface Dermatologist {
  id: number;
  user_id: number;
  license_number: string;
  specialization: string;
  years_of_experience: number;
  qualifications: string;
  bio?: string;
  consultation_fee: number;
  available_days: string[];
  start_time: string;
  end_time: string;
  timezone: string;
  is_available: boolean;
  max_patients_per_day: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export const dermatologistAPI = {
  // Get all available dermatologists
  getDermatologists: async () => {
    console.log('Making API call to /patient/dermatologists');
    const response = await apiClient.get<{ success: boolean; data: Dermatologist[] }>('/patient/dermatologists');
    console.log('API Response received:', response);
    return response;
  },
  
  // Get dermatologist by ID
  getDermatologist: (id: number) =>
    apiClient.get<{ success: boolean; data: Dermatologist }>(`/patient/dermatologists/${id}`),
};
