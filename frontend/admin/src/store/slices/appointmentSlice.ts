import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentAPI } from '../api/appointmentAPI';

interface Patient {
  id: number;
  name: string;
  email: string;
}

interface Dermatologist {
  user: {
    id: number;
    name: string;
  };
  specialization: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  dermatologist_id: number;
  scheduled_at: string;
  status: string;
  notes?: string;
  prescription?: string;
  zoom_link?: string;
  consultation_fee: number;
  is_paid: boolean;
  patient?: Patient;
  dermatologist?: Dermatologist;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await appointmentAPI.getAppointments();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearError: (state: AppointmentState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchAppointments.pending, (state: AppointmentState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state: AppointmentState, action: any) => {
        state.loading = false;
        state.appointments = action.payload.data;
      })
      .addCase(fetchAppointments.rejected, (state: AppointmentState, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
