import apiClient from './apiClient';

export interface DermatologistProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    dermatologistProfile?: {
        license_number?: string;
        specialization?: string;
        years_of_experience?: number;
        qualifications?: string;
        consultation_fee?: number;
        bio?: string;
    };
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    license_number?: string;
    specialization?: string;
    years_of_experience?: number;
    qualifications?: string;
    consultation_fee?: number;
    bio?: string;
}

export const profileAPI = {
    getProfile: () =>
        apiClient.get('/dermatologist/profile'),

    updateProfile: (data: UpdateProfileData) =>
        apiClient.put('/dermatologist/profile', data),
};
