import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uploadReducer from "../features/upload/uploadSlice";
import chatReducer from "../features/chat/chatSlice";
import historyReducer from "../features/chat/historySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    chat: chatReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
   