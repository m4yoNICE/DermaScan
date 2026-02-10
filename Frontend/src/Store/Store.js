import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    journal: journalReducer,
    skin: skinReducer,
    product: productReducer,
  },
});
