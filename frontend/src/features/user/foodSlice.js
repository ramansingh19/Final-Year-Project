import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../pages/services/apiClient";

// ADMIN - CREATE FOOD
export const createFood = createAsyncThunk(
  "food/createFood",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await apiClient.post("/api/food/create-Food", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create food"
      );
    }
  }
);

// ADMIN - GET FOOD
export const getFoodByRestaurantId = createAsyncThunk(
  "food/getFoodByRestaurantId",
  async (restaurantId, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await apiClient.get(`/api/food/admin/foods/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; // { success, count, data }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch foods"
      );
    }
  }
);

// ADMIN - UPDATE FOOD
export const updateFood = createAsyncThunk(
  "food/updateFood",
  async ({ foodId, data }, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await apiClient.put(
        `/api/food/admin/update-food/${foodId}`, // ✅ your route
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data; // { success, message, data }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update food"
      );
    }
  }
);

// ADMIN - TOOGLE Availability 
export const toggleFoodAvailability = createAsyncThunk(
  "food/toggleAvailability",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");
      
      const res = await apiClient.patch(
        `/api/food/admin/toggle-food/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed"
      );
    }
  }
);

const initialState = {
  foods: [],
  loading: false,
  error: null,
  success: false,
  count: 0,
  successMessage: null,
};

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    resetFoodState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ADMIN - CREATE FOOD
    builder
      .addCase(createFood.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createFood.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.foods.push(action.payload.data);
      })

      .addCase(createFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ADMIN - GET FOOD
    builder
      .addCase(getFoodByRestaurantId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getFoodByRestaurantId.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload;
        state.count = action.payload;
      })

      .addCase(getFoodByRestaurantId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ADMIN - UPDATE FOOD
    builder
      .addCase(updateFood.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(updateFood.fulfilled, (state, action) => {
        state.loading = false;

        const updatedFood = action.payload.data;

        // ✅ update in list
        state.foods = state.foods.map((f) =>
          f._id === updatedFood._id ? updatedFood : f
        );

        state.successMessage = action.payload.message;
      })

      .addCase(updateFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // ADMIN - TOOGLE Availability 
    builder
  .addCase(toggleFoodAvailability.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(toggleFoodAvailability.fulfilled, (state, action) => {
    state.loading = false;

    // ✅ update only that food (NO refetch needed)
    state.foods = state.foods.map((food) =>
      food._id === action.payload._id ? action.payload : food
    );
  })

  .addCase(toggleFoodAvailability.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  

  },
});

export const { resetFoodState } = foodSlice.actions;
export default foodSlice.reducer;
