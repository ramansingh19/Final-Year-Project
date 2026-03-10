import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

/* ----- Initial State -------- */
const initialState = {
  adminToken: localStorage.getItem("adminToken") || null, 
  isAuthenticated: false,
  role: null,
  admin: null,
  loading: false,
  error: null,
  registerSuccess: false,
  verifySuccess: false,
  loginSuccess: false
}

/* ----- adminRegistration ----- */
export const adminRegistration = createAsyncThunk("auth/adminRegisteration", async (data, thunkAPI) => {
  try {
    const response = await apiClient.post("/api/admin/admin-registration", data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "admin registration failed")
  }
})

/* -------- Slice -------- */
const adminAuthSlice = createSlice({
  name: "auth",
  initialState,

  reducers:{
    logout(state){
      state.adminToken = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem("adminToken")
    }
  },

  extraReducers: (builder) => {
    builder
    .addCase(adminRegistration.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registerSuccess = false
    })

    .addCase(adminRegistration.fulfilled, (state) => {
      state.loading = false;
      state.registerSuccess = true
    })

    .addCase(adminRegistration.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.registerSuccess = false
    })
  }
})

export default adminAuthSlice.reducer