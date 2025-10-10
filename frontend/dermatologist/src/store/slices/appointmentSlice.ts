import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentAPI } from '../api/appointmentAPI';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  patientProfile?: {
    allergies?: string;
    current_medications?: string;
  };
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
}

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.getAppointments();
      return response.data.data?.appointments || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointment = createAsyncThunk(
  'appointment/fetchAppointment',
  async (appointmentId: number, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.getAppointment(appointmentId);
      return response.data.data.appointment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointment/updateStatus',
  async ({ appointmentId, status, notes, prescription }: {
    appointmentId: number;
    status: string;
    notes?: string;
    prescription?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.updateAppointmentStatus(appointmentId, {
        status,
        notes,
        prescription,
      });
      return response.data.data.appointment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointment/reschedule',
  async ({ appointmentId, scheduled_at }: { appointmentId: number; scheduled_at: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.reschedule(appointmentId, scheduled_at);
      return response.data.data.appointment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reschedule appointment');
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
    setCurrentAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.currentAppointment = action.payload;
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
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Appointment
      .addCase(fetchAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Appointment Status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const updatedAppointment = action.payload;
        const index = state.appointments.findIndex(apt => apt.id === updatedAppointment.id);
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
        if (state.currentAppointment?.id === updatedAppointment.id) {
          state.currentAppointment = updatedAppointment;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reschedule Appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading = false;
        const updated = action.payload;
        const idx = state.appointments.findIndex(a => a.id === updated.id);
        if (idx !== -1) state.appointments[idx] = updated;
        if (state.currentAppointment?.id === updated.id) {
          state.currentAppointment = updated;
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
