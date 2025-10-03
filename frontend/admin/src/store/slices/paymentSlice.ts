import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentAPI } from '../api/paymentAPI';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Payment {
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
  failure_reason?: string;
  paid_at?: string;
  created_at: string;
  user?: User;
}

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPayments();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.payments = action.payload.data;
      })
      .addCase(fetchPayments.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
