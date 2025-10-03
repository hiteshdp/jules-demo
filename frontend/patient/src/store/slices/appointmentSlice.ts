import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentAPI } from '../api/appointmentAPI';

interface Dermatologist {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  specialization: string;
  consultation_fee: number;
  years_of_experience: number;
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
  dermatologist?: Dermatologist;
}

interface AppointmentState {
  appointments: Appointment[];
  dermatologists: Dermatologist[];
  loading: boolean;
  error: string | null;
  appointmentsLoaded: boolean;
  dermatologistsLoaded: boolean;
}

const initialState: AppointmentState = {
  appointments: [],
  dermatologists: [],
  loading: false,
  error: null,
  appointmentsLoaded: false,
  dermatologistsLoaded: false,
};

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { appointment: AppointmentState };
    // Skip if already loaded
    if (state.appointment.appointmentsLoaded) {
      return state.appointment.appointments;
    }
    
    try {
      const response = await appointmentAPI.getAppointments();
      // Extract appointments array from the API response
      return response.data.data.appointments || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchDermatologists = createAsyncThunk(
  'appointment/fetchDermatologists',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { appointment: AppointmentState };
    // Skip if already loaded
    if (state.appointment.dermatologistsLoaded) {
      return state.appointment.dermatologists;
    }
    
    try {
      const response = await appointmentAPI.getDermatologists();
      // Extract dermatologists array from the API response
      return response.data.data.dermatologists || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dermatologists');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (appointmentData: { dermatologist_id: number; scheduled_at: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.bookAppointment(appointmentData);
      // Extract appointment from the API response
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
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
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
        state.appointmentsLoaded = true;
      })
      .addCase(fetchAppointments.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure appointments remains an array even on error
        state.appointments = Array.isArray(state.appointments) ? state.appointments : [];
      })
      // Fetch Dermatologists
      .addCase(fetchDermatologists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDermatologists.fulfilled, (state, action: PayloadAction<Dermatologist[]>) => {
        state.loading = false;
        state.dermatologists = Array.isArray(action.payload) ? action.payload : [];
        state.dermatologistsLoaded = true;
      })
      .addCase(fetchDermatologists.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
