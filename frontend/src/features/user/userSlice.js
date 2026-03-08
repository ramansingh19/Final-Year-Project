import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

const initialState = {
  loading: false,
  user: null,
  error: null,
  message: null,
  profileUpdated: false,
  passwordChanged: false
};

/* ------------------- getUserData ------------------- */
export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/api/user/user-profile");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Get user data failed"
      );
    }
  }
);

/* ----------------------- updateUserProfile ------------------------ */
export const updateUserProfile = createAsyncThunk("user/updateUserProfile", async(data, thunkAPI) => {
  try {
    const response = await apiClient.put("/api/user/update-user-profile", data,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "user update failed")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    resetProfileUpdated(state) {
      state.profileUpdated = false;
    },
  },

  extraReducers: (builder) => {

    /* ------------------- getUserData ------------------- */
    builder
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
      })

      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      /* ----------------------- updateUserProfile ------------------------ */
      builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true,
        state.error = null,
        state.profileUpdated = false
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false,
        state.profileUpdated = true,
        state.user = action.payload,
        state.error = null
      })

      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false,
        state.error = action.payload,
        state.profileUpdated = false
      })

  }
});

export const  { clearUserError, resetProfileUpdated } = userSlice.actions
export default userSlice.reducer;