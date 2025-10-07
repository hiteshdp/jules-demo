// Generated via prompt: prompts/admin_patients_crud_v1.md
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { patientAPI } from '../api/patientAPI';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone_no?: string;
  password?: string;
  dob?: string;
  gender?: string;
  is_active: boolean;
  subscription_status: string;
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

export const createPatient = createAsyncThunk(
  'patient/create',
  async (data: { name: string; email: string; phone_no: string; dob?: string; gender?: 'male' | 'female' | 'other' }, { rejectWithValue }) => {
    try {
      const response = await patientAPI.createPatient(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create patient' });
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patient/update',
  async ({ patientId, data }: { patientId: number; data: Partial<{ name: string; email: string; phone_no: string; dob: string; gender: 'male' | 'female' | 'other' }> }, { rejectWithValue }) => {
    try {
      const response = await patientAPI.updatePatient(patientId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update patient' });
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patient/delete',
  async (patientId: number, { rejectWithValue }) => {
    try {
      const response = await patientAPI.deletePatient(patientId);
      return { id: patientId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete patient' });
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
      // Create patient
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<any>) => {
        const created = action.payload.data || action.payload;
        state.patients.unshift(created);
        if (state.pagination) {
          state.pagination.total += 1;
        }
      })
      // Update patient
      .addCase(updatePatient.fulfilled, (state, action: PayloadAction<any>) => {
        const updated = action.payload.data || action.payload;
        const index = state.patients.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          state.patients[index] = { ...state.patients[index], ...updated } as Patient;
        }
      })
      // Delete patient
      .addCase(deletePatient.fulfilled, (state, action: PayloadAction<any>) => {
        const id = action.payload.id;
        state.patients = state.patients.filter(p => p.id !== id);
        if (state.pagination) {
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;