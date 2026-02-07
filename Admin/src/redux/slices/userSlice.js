import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "@/services/Api";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  (_, { rejectWithValue, signal }) => {
    return Api.getUsersData({ signal })
      .then((response) => response.data)
      .catch((err) => {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return rejectWithValue("Request canceled");
        }

        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch users",
        );
      });
  },
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  (id, { rejectWithValue }) => {
    return Api.getUserById(id)
      .then((response) => response.data)
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch user",
        );
      });
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  (id, { rejectWithValue }) => {
    return Api.deleteUserAPI(id)
      .then((response) => {
        return { id, data: response.data };
      })
      .catch((err) => {
        return rejectWithValue(
          err.response?.data?.message || "Failed to delete user",
        );
      });
  },
);

//initial state
const initialState = {
  users: [],
  usersData: null,
  selectedUser: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  userByIdLoading: false,
  userByIdError: null,
};

//user slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //get user by id
      .addCase(getUserById.pending, (state) => {
        state.userByIdLoading = true;
        state.userByIdError = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userByIdLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userByIdLoading = false;
        state.userByIdError = action.payload;
      })
      //delete users
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
