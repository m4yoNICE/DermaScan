import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import skinProductReducer from "./slices/skinProductSlice";
import outOfScopeSlice from "./slices/outofscopeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: skinProductReducer,
    outOfScope: outOfScopeSlice,
  },
});
