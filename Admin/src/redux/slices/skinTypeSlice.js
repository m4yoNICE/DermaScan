import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../services/Api.js";

export const fetchSkinTypes = createAsyncThunk(
  "skinTypes/fetchSkinTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.getSkinTypes();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching skin types");
    }
  }
);

const skinTypeSlice = createSlice({
  name: "skinTypes",
  initialState: {
    skinTypes: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSkinTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkinTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.skinTypes = action.payload;
      })
      .addCase(fetchSkinTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default skinTypeSlice.reducer;