import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { patientAPI } from '../api/patientAPI';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  patientProfile?: any;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async (params: { page?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await patientAPI.getPatients(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const updatePatientStatus = createAsyncThunk(
  'patient/updateStatus',
  async ({ patientId, isActive }: { patientId: number; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await patientAPI.updatePatientStatus(patientId, { is_active: isActive });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient status');
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.patients = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
        };
      })
      .addCase(fetchPatients.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Patient Status
      .addCase(updatePatientStatus.fulfilled, (state, action: PayloadAction<Patient>) => {
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;
