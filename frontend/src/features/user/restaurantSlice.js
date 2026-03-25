import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../pages/services/apiClient";

/* -------- CREATE RESTAURANT ------- */
export const createRestaurant = createAsyncThunk(
  "restaurant/create",
  async (data, thunkAPI) => {
    try {
     
      const response = await apiClient.post("/api/resturant/create-restaurent", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);