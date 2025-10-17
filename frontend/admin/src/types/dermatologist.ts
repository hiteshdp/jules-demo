export interface Dermatologist {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    specialization: string;
    experience_years: number;
    clinic_name: string;
    status: 'active' | 'inactive';
    created_at: string;
}