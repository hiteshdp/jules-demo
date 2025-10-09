import apiClient from './apiClient';

export interface PatientProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    patientProfile?: {
        allergies?: string;
        current_medications?: string;
        smoking?: boolean;
        alcohol_consumption?: boolean;
    };
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    allergies?: string;
    current_medications?: string;
    smoking?: boolean;
    alcohol_consumption?: boolean;
}

export const profileAPI = {
    getProfile: () =>
        apiClient.get('/patient/profile'),

    updateProfile: (data: UpdateProfileData) =>
        apiClient.put('/patient/profile', data),
};
