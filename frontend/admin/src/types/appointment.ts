import { Patient } from './patient';

interface AppointmentDermatologist {
    id: number;
    name: string;
    // Add other relevant dermatologist properties if needed
}

export interface Appointment {
  id: number;
  patient_id: number;
  dermatologist_id: number;
  scheduled_at: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  consultation_fee: number;
  notes: string | null;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  patient: Patient;
  dermatologist: AppointmentDermatologist;
}