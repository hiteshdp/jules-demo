// Generated via prompt: prompts/razorpay_dynamic_payment_pages_v1.md

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subscriptionAPI, Subscription } from '../api/subscriptionAPI';

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  subscriptionLoaded: boolean;
  paymentLoading: boolean;
  paymentError: string | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
  subscriptionLoaded: false,
  paymentLoading: false,
  paymentError: null,
};

export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchSubscriptionStatus',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { subscription: SubscriptionState };
    // Skip if already loaded
    if (state.subscription.subscriptionLoaded) {
      return state.subscription.subscription;
    }
    
    try {
      const response = await subscriptionAPI.getSubscriptionStatus();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription status');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.createSubscription();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subscription');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'subscription/verifyPayment',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.verifyPayment(paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancelSubscription();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
    },
    clearSubscription: (state) => {
      state.subscription = null;
      state.subscriptionLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subscription Status
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action: PayloadAction<Subscription | null>) => {
        state.loading = false;
        state.subscription = action.payload;
        state.subscriptionLoaded = true;
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(createSubscription.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentLoading = false;
        // Don't update subscription here, wait for verification
      })
      .addCase(createSubscription.rejected, (state, action: PayloadAction<any>) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action: PayloadAction<any>) => {
        state.paymentLoading = false;
        if (action.payload.success) {
          state.subscription = action.payload.data;
          state.subscriptionLoaded = true;
        }
      })
      .addCase(verifyPayment.rejected, (state, action: PayloadAction<any>) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(cancelSubscription.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
