import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import dermatologistReducer from './slices/dermatologistSlice';
import appointmentReducer from './slices/appointmentSlice';
import productReducer from './slices/productSlice';
import paymentReducer from './slices/paymentSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    dermatologist: dermatologistReducer,
    appointment: appointmentReducer,
    product: productReducer,
    payment: paymentReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
