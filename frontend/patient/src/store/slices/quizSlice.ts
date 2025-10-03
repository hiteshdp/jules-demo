import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quizAPI } from '../api/quizAPI';

interface QuizQuestion {
  id: number;
  question: string;
  type: string;
  options?: string[];
  order: number;
  is_required: boolean;
}

interface QuizResponse {
  question_id: number;
  answer: string;
}

interface QuizState {
  questions: QuizQuestion[];
  responses: QuizResponse[];
  loading: boolean;
  error: string | null;
  isSubmitted: boolean;
  questionsLoaded: boolean;
}

const initialState: QuizState = {
  questions: [],
  responses: [],
  loading: false,
  error: null,
  isSubmitted: false,
  questionsLoaded: false,
};

export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { quiz: QuizState };
    // Skip if already loaded
    if (state.quiz.questionsLoaded) {
      return state.quiz.questions;
    }
    
    try {
      const response = await quizAPI.getQuestions();
      // Extract questions array from the API response
      return response.data.data.questions || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async (responses: QuizResponse[], { rejectWithValue }) => {
    try {
      const response = await quizAPI.submitQuiz({ responses });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    updateResponse: (state, action: PayloadAction<{ questionId: number; answer: string }>) => {
      const { questionId, answer } = action.payload;
      const existingIndex = state.responses.findIndex(r => r.question_id === questionId);
      
      if (existingIndex >= 0) {
        state.responses[existingIndex].answer = answer;
      } else {
        state.responses.push({ question_id: questionId, answer });
      }
    },
    clearResponses: (state) => {
      state.responses = [];
      state.isSubmitted = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<QuizQuestion[]>) => {
        state.loading = false;
        state.questions = Array.isArray(action.payload) ? action.payload : [];
        state.questionsLoaded = true;
      })
      .addCase(fetchQuestions.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure questions remains an array even on error
        state.questions = Array.isArray(state.questions) ? state.questions : [];
      })
      // Submit Quiz
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state) => {
        state.loading = false;
        state.isSubmitted = true;
      })
      .addCase(submitQuiz.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateResponse, clearResponses, clearError } = quizSlice.actions;
export default quizSlice.reducer;
