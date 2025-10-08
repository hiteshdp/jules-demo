import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import appointmentReducer from './slices/appointmentSlice';
import dermatologistReducer from './slices/dermatologistSlice';
import chatReducer from './slices/chatSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    appointment: appointmentReducer,
    dermatologist: dermatologistReducer,
    chat: chatReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
