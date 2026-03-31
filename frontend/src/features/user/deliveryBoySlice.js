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

      return response.deliveryBoy;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

// DELIVERY BOY - UPDATE DELIVERY BOY STATUS
export const updateDeliveryBoyStatus = createAsyncThunk(
  "deliveryBoy/updateStatus",   
  async ({ id, isOnline, isAvailable }, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await apiClient.put(`/api/deliveryBoy/status/${id}`, { isOnline, isAvailable },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.deliveryBoy;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

// DELIVERY BOY - UPDATE LIVE LOCATION
export const updateLiveLocationThunk = createAsyncThunk(
  "deliveryBoy/updateLiveLocation",
  async ({ id, latitude, longitude }, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken"); // or delivery boy token

      const response = await apiClient.put(
        `/api/deliveryBoy/location/${id}`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.deliveryBoy;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update location"
      );
    }
  }
);

// DELIVERY BOY - GET PENDING ORDERS
export const getPendingOrdersThunk = createAsyncThunk(
  "deliveryBoy/getPendingOrders",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("adminToken");
      
      const response = await apiClient.get("/api/deliveryBoy/orders/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// ADMIN - GET AVAILABLE DELIVERY BOY
export const getAvailableDeliveryBoysThunk = createAsyncThunk(
  "deliveryBoy/getAvailable",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/api/deliveryBoy/available");
      return res.deliveryBoys;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const initialState = {
  deliveryBoys: [],
  profile: null,
  orders: [],
  loading: false,
  error: null,
};

const deliveryBoySlice = createSlice({
  name: "deliveryBoy",
  initialState,
  reducers: {
    // optional: set delivery boys list
    setDeliveryBoys: (state, action) => {
      state.deliveryBoys = action.payload;
    },
  },
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

    // DELIVERY BOY - UPDATE DELIVERY BOY STATUS
    builder  
    .addCase(updateDeliveryBoyStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateDeliveryBoyStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload; // update profile with latest DeliveryBoy doc
    })
    .addCase(updateDeliveryBoyStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // DELIVERY BOY - UPDATE LIVE LOCATION
    builder
  .addCase(updateLiveLocationThunk.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateLiveLocationThunk.fulfilled, (state, action) => {
    state.loading = false;
    state.profile = action.payload; // update profile with latest location
  })
  .addCase(updateLiveLocationThunk.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  // DELIVERY BOY - GET PENDING ORDERS
  builder
      .addCase(getPendingOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getPendingOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      builder
      .addCase(getAvailableDeliveryBoysThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableDeliveryBoysThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryBoys = action.payload;
      })
      .addCase(getAvailableDeliveryBoysThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch";
      });  
    
  },
});

export default deliveryBoySlice.reducer;