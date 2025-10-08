import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardAPI } from '../api/dashboardAPI';

export interface DashboardStats {
    total_patients: number;
    total_dermatologists: number;
    total_appointments: number;
    total_revenue: number;
    pending_appointments: number;
    active_subscriptions: number;
}

export interface MonthlyTrend {
    month: string;
    count?: number;
    total?: number;
}

export interface DashboardData {
    stats: DashboardStats;
    monthly_appointments: MonthlyTrend[];
    monthly_revenue: MonthlyTrend[];
}

interface DashboardState {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    loading: false,
    error: null,
};

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const response = await dashboardAPI.getDashboard();
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch dashboard data'
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state: DashboardState) => {
            state.error = null;
        },
        resetDashboard: (state: DashboardState) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(fetchDashboardData.pending, (state: DashboardState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state: DashboardState, action: any) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchDashboardData.rejected, (state: DashboardState, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
