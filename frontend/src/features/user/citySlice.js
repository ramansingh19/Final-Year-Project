import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

const initialState = {
  city: null,
  loading: false,
  error: null,
  createSuccess: false
};

/* -------- Create City -------- */
export const createCity = createAsyncThunk(
  "city/createCity",
  async (data, thunkAPI) => {
    try {
      const superAdminToken = localStorage.getItem("superAdminToken")
      const response = await apiClient.post("/api/city/create-city", data,{
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create city failed"
      );
    }
  }
);

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(createCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createCity.fulfilled, (state, action) => {
        state.loading = false;
        state.city = action.payload.data;
        state.createSuccess = true;
      })

      .addCase(createCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("CITY ERROR:", action.payload);
      });


  },
}); 

export default citySlice.reducer