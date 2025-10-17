export interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    patientProfile: PatientProfile | null;
}

export interface PatientProfile {
    id: number;
    user_id: number;
    date_of_birth: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}