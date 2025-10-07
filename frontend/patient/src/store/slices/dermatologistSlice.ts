// Generated via prompt: prompts/dermatologist_fetch_functionality_v1.md
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dermatologistAPI, Dermatologist } from '../api/dermatologistAPI';

interface DermatologistState {
  dermatologists: Dermatologist[];
  selectedDermatologist: Dermatologist | null;
  loading: boolean;
  error: string | null;
}

const initialState: DermatologistState = {
  dermatologists: [],
  selectedDermatologist: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchDermatologists = createAsyncThunk(
  'dermatologist/fetchDermatologists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dermatologistAPI.getDermatologists();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dermatologists');
    }
  }
);

export const fetchDermatologistById = createAsyncThunk(
  'dermatologist/fetchDermatologistById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await dermatologistAPI.getDermatologist(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dermatologist');
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
    clearSelectedDermatologist: (state) => {
      state.selectedDermatologist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dermatologists
      .addCase(fetchDermatologists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDermatologists.fulfilled, (state, action: PayloadAction<Dermatologist[]>) => {
        state.loading = false;
        state.dermatologists = action.payload;
        state.error = null;
      })
      .addCase(fetchDermatologists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch dermatologist by ID
      .addCase(fetchDermatologistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDermatologistById.fulfilled, (state, action: PayloadAction<Dermatologist>) => {
        state.loading = false;
        state.selectedDermatologist = action.payload;
        state.error = null;
      })
      .addCase(fetchDermatologistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedDermatologist } = dermatologistSlice.actions;
export default dermatologistSlice.reducer;
