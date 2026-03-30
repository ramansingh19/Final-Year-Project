import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../pages/services/apiClient";

// DELIVERY BOY - Get Delivery Boy Profile
export const getDeliveryBoyProfileThunk = createAsyncThunk(
  "deliveryBoy/getProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await apiClient.get("/api/deliveryBoy/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.deliveryBoy);
      return response.deliveryBoy;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);


const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const deliveryBoySlice = createSlice({
  name: "deliveryBoy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  
  // DELIVERY BOY - Get Delivery Boy Profile  
    builder
      .addCase(getDeliveryBoyProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDeliveryBoyProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(getDeliveryBoyProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deliveryBoySlice.reducer;