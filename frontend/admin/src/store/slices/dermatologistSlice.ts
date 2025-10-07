// Generated via prompt: prompts/admin_dermatologists_crud_v1.md
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dermatologistAPI } from '../api/dermatologistAPI';

interface Dermatologist {
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
  dermatologistProfile?: any;
}

interface DermatologistState {
  dermatologists: Dermatologist[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const initialState: DermatologistState = {
  dermatologists: [],
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  },
};

export const fetchDermatologists = createAsyncThunk(
  'dermatologist/fetchDermatologists',
  async (params: { page?: number; search?: string } = {}, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await dermatologistAPI.getDermatologists(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dermatologists');
    }
  }
);

export const createDermatologist = createAsyncThunk(
  'dermatologist/createDermatologist',
  async (data: { name: string; email: string; phone_no: string; password: string; dob?: string; gender?: 'male' | 'female' | 'other' }, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await dermatologistAPI.createDermatologist(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create dermatologist');
    }
  }
);

export const updateDermatologist = createAsyncThunk(
  'dermatologist/updateDermatologist',
  async ({ dermatologistId, data }: { dermatologistId: number; data: Partial<{ name: string; email: string; phone_no: string; password: string; dob: string; gender: 'male' | 'female' | 'other' }> }, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await dermatologistAPI.updateDermatologist(dermatologistId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update dermatologist');
    }
  }
);

export const deleteDermatologist = createAsyncThunk(
  'dermatologist/deleteDermatologist',
  async (dermatologistId: number, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      await dermatologistAPI.deleteDermatologist(dermatologistId);
      return dermatologistId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete dermatologist');
    }
  }
);

const dermatologistSlice = createSlice({
  name: 'dermatologist',
  initialState,
  reducers: {
    clearError: (state: DermatologistState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch dermatologists
      .addCase(fetchDermatologists.pending, (state: DermatologistState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDermatologists.fulfilled, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.dermatologists = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
        };
      })
      .addCase(fetchDermatologists.rejected, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create dermatologist
      .addCase(createDermatologist.pending, (state: DermatologistState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDermatologist.fulfilled, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.dermatologists.unshift(action.payload.data);
      })
      .addCase(createDermatologist.rejected, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update dermatologist
      .addCase(updateDermatologist.pending, (state: DermatologistState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDermatologist.fulfilled, (state: DermatologistState, action: any) => {
        state.loading = false;
        const index = state.dermatologists.findIndex((d: Dermatologist) => d.id === action.payload.data.id);
        if (index !== -1) {
          state.dermatologists[index] = action.payload.data;
        }
      })
      .addCase(updateDermatologist.rejected, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete dermatologist
      .addCase(deleteDermatologist.pending, (state: DermatologistState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDermatologist.fulfilled, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.dermatologists = state.dermatologists.filter((d: Dermatologist) => d.id !== action.payload);
      })
      .addCase(deleteDermatologist.rejected, (state: DermatologistState, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dermatologistSlice.actions;
export default dermatologistSlice.reducer;