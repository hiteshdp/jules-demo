import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../api/authAPI';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  profile_image?: string;
  patientProfile?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userLoaded: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  userLoaded: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    // Skip if already loaded
    if (state.auth.userLoaded) {
      return state.auth.user;
    }
    
    // Check if we have a token
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }
    
    try {
      const response = await authAPI.getMe();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
    } catch (error: any) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Safely access payload properties
        if (action.payload && action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.userLoaded = true;
          state.error = null;
        } else {
          // Handle malformed response
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.userLoaded = false;
          state.error = 'Invalid response from server';
        }
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.userLoaded = false;
        state.error = action.payload || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Safely access payload properties
        if (action.payload && action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.userLoaded = true;
          state.error = null;
        } else {
          // Handle malformed response
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.userLoaded = false;
          state.error = 'Invalid response from server';
        }
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.userLoaded = false;
        state.error = action.payload || 'Registration failed';
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Safely access payload properties
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.userLoaded = true;
          state.error = null;
        } else {
          // Handle malformed response or unauthenticated
          state.user = null;
          state.isAuthenticated = false;
          state.userLoaded = false;
          state.token = null;
          localStorage.removeItem('token');
          state.error = 'User not authenticated';
        }
      })
      .addCase(getMe.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.userLoaded = false;
        localStorage.removeItem('token');
        state.error = action.payload || 'Failed to get user data';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
