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
  selectedAppointment: Appointment | null;
  chatMessages: any[];
  dermatologists: any[];
  patients: any[];
  filters: {
    status: string;
    dermatologist_id: string;
    patient_id: string;
    date_from: string;
    date_to: string;
  };
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
  selectedAppointment: null,
  chatMessages: [],
  dermatologists: [],
  patients: [],
  filters: {
    status: '',
    dermatologist_id: '',
    patient_id: '',
    date_from: '',
    date_to: '',
  },
};

export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (filters: any, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await appointmentAPI.getAppointments(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointmentDetails = createAsyncThunk(
  'appointment/fetchAppointmentDetails',
  async (id: number, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await appointmentAPI.getAppointmentDetails(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment details');
    }
  }
);

export const fetchAppointmentChat = createAsyncThunk(
  'appointment/fetchAppointmentChat',
  async (id: number, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await appointmentAPI.getAppointmentChat(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat messages');
    }
  }
);

export const fetchDermatologistsForFilter = createAsyncThunk(
  'appointment/fetchDermatologistsForFilter',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await appointmentAPI.getDermatologistsForFilter();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dermatologists');
    }
  }
);

export const fetchPatientsForFilter = createAsyncThunk(
  'appointment/fetchPatientsForFilter',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await appointmentAPI.getPatientsForFilter();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const updateAppointmentPaymentStatus = createAsyncThunk(
  'appointment/updateAppointmentPaymentStatus',
  async (
    { id, status }: { id: number; status: string },
    { rejectWithValue }: { rejectWithValue: (value: any) => any }
  ) => {
    try {
      const response = await appointmentAPI.updatePaymentStatus(id, status);
      return { id, status, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
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
    setFilters: (state: AppointmentState, action: any) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state: AppointmentState) => {
      state.filters = {
        status: '',
        dermatologist_id: '',
        patient_id: '',
        date_from: '',
        date_to: '',
      };
    },
    setSelectedAppointment: (state: AppointmentState, action: any) => {
      state.selectedAppointment = action.payload;
    },
    clearSelectedAppointment: (state: AppointmentState) => {
      state.selectedAppointment = null;
    },
    clearChatMessages: (state: AppointmentState) => {
      state.chatMessages = [];
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state: AppointmentState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state: AppointmentState, action: any) => {
        state.loading = false;
        // Debug logging
        console.log('Appointments API Response:', action.payload);

        // Handle paginated response - extract the actual appointments array
        if (action.payload.data && action.payload.data.data) {
          state.appointments = Array.isArray(action.payload.data.data) ? action.payload.data.data : [];
        } else {
          state.appointments = Array.isArray(action.payload.data) ? action.payload.data : [];
        }

        console.log('Processed appointments:', state.appointments);
      })
      .addCase(fetchAppointments.rejected, (state: AppointmentState, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.appointments = []; // Ensure appointments is always an array
        console.error('Appointments fetch failed:', action.payload);
      })
      // Fetch appointment details
      .addCase(fetchAppointmentDetails.fulfilled, (state: AppointmentState, action: any) => {
        state.selectedAppointment = action.payload.data;
      })
      // Fetch appointment chat
      .addCase(fetchAppointmentChat.fulfilled, (state: AppointmentState, action: any) => {
        state.chatMessages = action.payload.data;
      })
      // Fetch dermatologists for filter
      .addCase(fetchDermatologistsForFilter.fulfilled, (state: AppointmentState, action: any) => {
        state.dermatologists = action.payload.data;
      })
      // Fetch patients for filter
      .addCase(fetchPatientsForFilter.fulfilled, (state: AppointmentState, action: any) => {
        state.patients = action.payload.data;
      })
      // Update appointment payment status (optimistic update)
      .addCase(updateAppointmentPaymentStatus.pending, (state: AppointmentState, action: any) => {
        const { id, status } = action.meta.arg;
        const appt = state.appointments.find((a) => a.id === id);
        if (appt) {
          appt.is_paid = status === 'completed';
        }
      })
      .addCase(updateAppointmentPaymentStatus.rejected, (state: AppointmentState, action: any) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setSelectedAppointment,
  clearSelectedAppointment,
  clearChatMessages
} = appointmentSlice.actions;
export default appointmentSlice.reducer;
