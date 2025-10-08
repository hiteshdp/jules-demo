import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import appointmentReducer from './slices/appointmentSlice';
import dermatologistReducer from './slices/dermatologistSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    appointment: appointmentReducer,
    dermatologist: dermatologistReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
