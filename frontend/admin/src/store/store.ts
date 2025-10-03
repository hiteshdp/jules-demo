import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import patientReducer from './slices/patientSlice';
import dermatologistReducer from './slices/dermatologistSlice';
import appointmentReducer from './slices/appointmentSlice';
import productReducer from './slices/productSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    patient: patientReducer,
    dermatologist: dermatologistReducer,
    appointment: appointmentReducer,
    product: productReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
