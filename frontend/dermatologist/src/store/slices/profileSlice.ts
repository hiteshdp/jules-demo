import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileAPI, DermatologistProfile, UpdateProfileData } from '../api/profileAPI';

interface ProfileState {
    profile: DermatologistProfile | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
};

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileAPI.getProfile();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (data: UpdateProfileData, { rejectWithValue }) => {
        try {
            const response = await profileAPI.updateProfile(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setProfile: (state, action: PayloadAction<DermatologistProfile>) => {
            state.profile = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.data;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.data;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
