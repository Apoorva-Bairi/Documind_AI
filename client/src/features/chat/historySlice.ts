import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

type HistoryItem = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
};

type HistoryState = {
  history: HistoryItem[];
  loading: boolean;
  error: string | null;
};

const initialState: HistoryState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchHistory = createAsyncThunk(
  "history/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/history");
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);

export const clearHistory = createAsyncThunk(
  "history/clear",
  async (_, { rejectWithValue }) => {
    try {
      await API.delete("/history");
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear history"
      );
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder.addCase(clearHistory.fulfilled, (state) => {
    state.history = [];
       })
  },
});

export default historySlice.reducer;