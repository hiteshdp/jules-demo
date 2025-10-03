import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dermatologistAPI } from '../api/dermatologistAPI';

interface Dermatologist {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  specialization: string;
  years_of_experience: number;
  consultation_fee: number;
  is_available: boolean;
}

interface DermatologistState {
  dermatologists: Dermatologist[];
  loading: boolean;
  error: string | null;
}

const initialState: DermatologistState = {
  dermatologists: [],
  loading: false,
  error: null,
};

export const fetchDermatologists = createAsyncThunk(
  'dermatologist/fetchDermatologists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dermatologistAPI.getDermatologists();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dermatologists');
    }
  }
);

export const createDermatologist = createAsyncThunk(
  'dermatologist/createDermatologist',
  async (dermatologistData: any, { rejectWithValue }) => {
    try {
      const response = await dermatologistAPI.createDermatologist(dermatologistData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create dermatologist');
    }
  }
);

const dermatologistSlice = createSlice({
  name: 'dermatologist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dermatologists
      .addCase(fetchDermatologists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDermatologists.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.dermatologists = action.payload.data;
      })
      .addCase(fetchDermatologists.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Dermatologist
      .addCase(createDermatologist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDermatologist.fulfilled, (state, action: PayloadAction<Dermatologist>) => {
        state.loading = false;
        state.dermatologists.unshift(action.payload);
      })
      .addCase(createDermatologist.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dermatologistSlice.actions;
export default dermatologistSlice.reducer;
