import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import skinProductReducer from "./slices/skinProductSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: skinProductReducer,
  },
});
