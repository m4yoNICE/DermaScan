import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "@/services/Api.js";

export const fetchOutOfScopeData = createAsyncThunk(
  "outOfScope/fetchOutOfScopeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getOutofScopeData();
      return response.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch out-of-scope data.");
    }
  }
);

const outofscopeSlice = createSlice({
  name: "outOfScope",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutOfScopeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutOfScopeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOutOfScopeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default outofscopeSlice.reducer;