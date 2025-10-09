// Generated via prompt: prompts/appointment_chat_feature_v1.md
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatAPI, ChatMessage } from '../api/chatAPI';

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

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { appointmentId, message }: { appointmentId: number; message: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatAPI.sendMessage(appointmentId, { message });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
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
        // Don't show loading spinner to avoid flicker
        state.loading = false;
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
      .addCase(sendChatMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.sending = false;
        if (!state.messages.find(m => m.id === action.payload.id)) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendChatMessage.rejected, (state, action: PayloadAction<any>) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;


