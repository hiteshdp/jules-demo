import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
  async (_, { rejectWithValue }) => {
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.appointments = action.payload.data;
      })
      .addCase(fetchAppointments.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
