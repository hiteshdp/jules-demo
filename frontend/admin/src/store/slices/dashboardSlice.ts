import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardAPI } from '../api/dashboardAPI';

interface DashboardStats {
  total_patients: number;
  total_dermatologists: number;
  total_appointments: number;
  total_revenue: number;
  pending_appointments: number;
  active_subscriptions: number;
}

interface MonthlyData {
  month: string;
  count?: number;
  total?: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  monthlyAppointments: MonthlyData[];
  monthlyRevenue: MonthlyData[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  monthlyAppointments: [],
  monthlyRevenue: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getDashboardData();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.monthlyAppointments = action.payload.monthly_appointments;
        state.monthlyRevenue = action.payload.monthly_revenue;
      })
      .addCase(fetchDashboardData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
