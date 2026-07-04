import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

type UploadState = {
  loading: boolean;
  success: boolean;
  error: string | null;
  fileName: string | null;
  chunksStored: number | null;
};

const initialState: UploadState = {
  loading: false,
  success: false,
  error: null,
  fileName: null,
  chunksStored: null,
};

export const uploadFile = createAsyncThunk(
  "upload/file",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/upload", formData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Upload failed");
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    resetUploadStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.fileName = action.payload.data.fileName;
        state.chunksStored = action.payload.data.chunksStored;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUploadStatus } = uploadSlice.actions;
export default uploadSlice.reducer;