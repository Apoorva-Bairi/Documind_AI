import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

type Source = {
  id: string;
  source: string;
  chunkIndex: number;
  score: number;
  text: string;
};

type ChatState = {
  answer: string;
  sources: Source[];
  loading: boolean;
  error: string | null;
};

const initialState: ChatState = {
  answer: "",
  sources: [],
  loading: false,
  error: null,
};

export const askQuestion = createAsyncThunk(
  "chat/askQuestion",
  async (question: string, { rejectWithValue }) => {
    try {
      const res = await API.post("/ask", { question });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Question failed");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearAnswer: (state) => {
      state.answer = "";
      state.sources = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.answer = action.payload.answer;
        state.sources = action.payload.sources;
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnswer } = chatSlice.actions;
export default chatSlice.reducer;