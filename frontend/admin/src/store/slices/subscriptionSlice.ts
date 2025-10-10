// Generated via prompt: prompts/admin_subscription_management_v1.md

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/subscriptionAPI';

export interface Subscription {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    plan_name: string;
    description: string;
    price: number;
    billing_cycle: string;
    status: 'active' | 'cancelled' | 'expired' | 'pending' | 'paused';
    razorpay_subscription_id?: string;
    razorpay_plan_id?: string;
    auto_renew: boolean;
    starts_at?: string;
    ends_at?: string;
    cancelled_at?: string;
    next_billing_date?: string;
    last_payment_date?: string;
    total_payments?: number;
    total_amount_paid?: number;
    next_payment_due?: string;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: number;
    user_id: number;
    payable_type: string;
    payable_id: number;
    type: string;
    amount: number;
    currency: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    status: string;
    razorpay_response?: any;
    paid_at?: string;
    created_at: string;
    updated_at: string;
}

export interface SubscriptionFilters {
    status?: string;
    patient_name?: string;
    date_from?: string;
    date_to?: string;
    per_page?: number;
}

export interface SubscriptionStatistics {
    total_subscriptions: number;
    active_subscriptions: number;
    cancelled_subscriptions: number;
    expired_subscriptions: number;
    pending_subscriptions: number;
    total_revenue: number;
    monthly_revenue: number;
}

interface SubscriptionState {
    subscriptions: Subscription[];
    currentSubscription: Subscription | null;
    statistics: SubscriptionStatistics | null;
    loading: boolean;
    error: string | null;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    filters: SubscriptionFilters;
}

const initialState: SubscriptionState = {
    subscriptions: [],
    currentSubscription: null,
    statistics: null,
    loading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: 15,
        total: 0,
    },
    filters: {
        per_page: 15,
    },
};

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetchSubscriptions',
    async (params: SubscriptionFilters = {}, { rejectWithValue }: any) => {
        try {
            const response = await api.get('/admin/subscriptions', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
        }
    }
);

export const fetchSubscriptionDetails = createAsyncThunk(
    'subscriptions/fetchSubscriptionDetails',
    async (id: number, { rejectWithValue }: any) => {
        try {
            const response = await api.get(`/admin/subscriptions/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription details');
        }
    }
);



export const fetchSubscriptionStatistics = createAsyncThunk(
    'subscriptions/fetchSubscriptionStatistics',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const response = await api.get('/admin/subscriptions/statistics');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setFilters: (state: any, action: any) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state: any) => {
            state.filters = { per_page: 15 };
        },
        setPagination: (state: any, action: any) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearError: (state: any) => {
            state.error = null;
        },
    },
    extraReducers: (builder: any) => {
        builder
            // Fetch subscriptions
            .addCase(fetchSubscriptions.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.subscriptions = action.payload.data.data;
                state.pagination = {
                    current: action.payload.data.current_page,
                    pageSize: action.payload.data.per_page,
                    total: action.payload.data.total,
                };
            })
            .addCase(fetchSubscriptions.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch subscription details
            .addCase(fetchSubscriptionDetails.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionDetails.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.currentSubscription = action.payload.data;
            })
            .addCase(fetchSubscriptionDetails.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch statistics
            .addCase(fetchSubscriptionStatistics.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionStatistics.fulfilled, (state: any, action: any) => {
                state.loading = false;
                state.statistics = action.payload.data;
            })
            .addCase(fetchSubscriptionStatistics.rejected, (state: any, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, setPagination, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;