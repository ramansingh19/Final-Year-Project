import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import authApi from "./authApi";

/* -------------- Initial State ---------------- */
const initialState = {
  token : localStorage.getItem("token"),
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
  registerSuccess: false
}

/* -------------- User Registration ------------------- */
export const register = createAsyncThunk("http://localhost:3000/api/user/user-registration", async (data, {rejectWithValue}) => {
  try {
    return await authApi.register(data)
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

/* ------------- Slice -------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers:{
    logout(state){
      state.token = null,
      state.isAuthenticated = false,
      state.role = null,
      localStorage.removeItem("token")
    },
    clearAuthError(state){
      state.error = null
    }
  },

  extraReducers: (builder) => {
    /* ------------ Register -------------- */
    builder.addCase(register.pending, (state) => {
      state.loading = true
      state.error = null
      state.registerSuccess = false
    })

    builder.addCase(register.fulfilled, (state) => {
      state.loading = false,
      state.registerSuccess = true
    })

    builder.addCase(register.rejected, (state, action) => {
      state.loading = false,
      state.error = action.payload
    })


  }
})

export default authSlice.reducer

