import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatAPI } from '../api/chatAPI';

interface ChatMessage {
  id: number;
  appointment_id: number;
  sender_id: number;
  message: string;
  attachment?: string;
  type: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    role: string;
  };
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sending: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  sending: false,
};

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (appointmentId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { chat: ChatState };
      const existing = state.chat.messages;
      const lastId = existing.length > 0 ? existing[existing.length - 1].id : undefined;
      const response = await chatAPI.getMessages(appointmentId, lastId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ appointmentId, message, type, attachment }: {
    appointmentId: number;
    message: string;
    type?: string;
    attachment?: File;
  }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(appointmentId, message, type, attachment);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (appointmentId: number, { rejectWithValue }) => {
    try {
      const response = await chatAPI.markAsRead(appointmentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.error = null;
        // Only show loading spinner when there are no messages yet to avoid flicker
        state.loading = state.messages.length === 0;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.loading = false;
        if (state.messages.length === 0) {
          state.messages = action.payload;
          return;
        }
        const existingIds = new Set(state.messages.map(m => m.id));
        const newOnes = action.payload.filter(m => !existingIds.has(m.id));
        if (newOnes.length > 0) {
          state.messages = [...state.messages, ...newOnes];
        }
      })
      .addCase(fetchChatMessages.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.sending = false;
        if (!state.messages.find(m => m.id === action.payload.id)) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action: PayloadAction<any>) => {
        state.sending = false;
        state.error = action.payload;
      })
      // Mark as Read
      .addCase(markMessagesAsRead.fulfilled, (state) => {
        state.messages.forEach(message => {
          message.is_read = true;
        });
      });
  },
});

export const { clearError, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
