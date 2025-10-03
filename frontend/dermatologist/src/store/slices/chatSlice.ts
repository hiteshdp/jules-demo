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
  async (appointmentId: number, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(appointmentId);
      return response.data;
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
      return response.data;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.loading = false;
        state.messages = action.payload;
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
        state.messages.push(action.payload);
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
