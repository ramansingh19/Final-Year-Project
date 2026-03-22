import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../pages/services/apiClient";

const initialState = {
  places: [],
  cityWisePlaces: [],
  loading: false,
  error: null,
  success: false,
};

/* -------- Create Place -------- */
export const createPlace = createAsyncThunk(
  "place/createPlace",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("superAdminToken");

      const response = await apiClient.post(
        "/api/place/create-place",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data; // ✅ important
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Place creation failed"
      );
    }
  }
);

/* -------- get pending places -------- */
export const getPendingPlaces = createAsyncThunk("place/getPendingPlaces", async (_, thunkAPI) => {
  try {
    const superAdminToken = localStorage.getItem("superAdminToken")

    const response = await apiClient.get("/api/admin/places/pending", {
      headers: {
        Authorization: `Bearer ${superAdminToken}`
      }
    })
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch cities"
    );
  }
})


/* -------- approve Place -------- */
export const approvePlaceById = createAsyncThunk("place/approvePleace", async (placeId, thunkAPI) => {
  try {
    const superAdminToken = localStorage.getItem("superAdminToken")
    const response = await apiClient.patch(`/api/admin/place/${placeId}/approve`,
    {},
    {
      headers: {Authorization: `Bearer ${superAdminToken}`}
    })

    return {placeId, message: response.data.message}
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "City approval failed"
    );
  }
})

/* -------- rejected Place -------- */
export const rejectePlaceById = createAsyncThunk("place/rejectPlace", async (placeId, thunkAPI) => {
  try {
    const superAdminToken = localStorage.getItem("superAdminToken")
    const response = await apiClient.patch(`/api/admin/place/${placeId}/reject`, {}, {
      headers: {Authorization: `Bearer ${superAdminToken}`}
    })
    return { cityId, message: response.data.message };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "City rejection failed"
    );
  }
})

/* -------- get Place cityWise -------- */
export const getPlacesCityWise = createAsyncThunk(
  "place/getPlacesCityWise",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("superAdminToken");

      const response = await apiClient.get("/api/place/city-wise", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch places"
      );
    }
  }
);

/* -------- get Active Place cityWise -------- */
export const getActivePlacesCityWise = createAsyncThunk(
  "place/getActivePlacesCityWise",
  async (_, thunkAPI) => {
    try {
      const res = await apiClient.get("/api/place/activePlace/city-wise");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed"
      );
    }
  }
);


const placeSlice = createSlice({
  name:"place",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    
  /* -------- Create Place -------- */
  builder
  .addCase(createPlace.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.success = false;
  })

  .addCase(createPlace.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;

    // add new place in list
    state.places.push(action.payload);
  })

  .addCase(createPlace.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.success = false;
  });

    /* -------- get pending places -------- */
    builder
    .addCase(getPendingPlaces.pending, (state) => {
    state.loading = true;
    state.error = null
    })
  
    builder
    .addCase(getPendingPlaces.fulfilled, (state, action) => {
      state.loading = false;
      state.places = action.payload;
    })
  
    builder
    .addCase(getPendingPlaces.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

  /* -------- approve Place -------- */
  builder
  .addCase(approvePlaceById.pending, (state) => {
    state.loading = true;
    state.error = null;
  })

  .addCase(approvePlaceById.fulfilled, (state, action) => {
    state.loading = false;
    const place = state.places.find((p) => p._id === action.payload.placeId);
    if(place) place.status = "active"
  })

  .addCase(approvePlaceById.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

  /* -------- rejected Place -------- */
  builder
  .addCase(rejectePlaceById.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(rejectePlaceById.fulfilled, (state, action) => {
    state.loading = false;
    const place = state.places.find((p) => p._id === action.payload.placeId);
    if (place) place.status = "rejected";
  })
  .addCase(rejectePlaceById.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  /* -------- get Place cityWise -------- */
  builder
  .addCase(getPlacesCityWise.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getPlacesCityWise.fulfilled, (state, action) => {
    state.loading = false;
    state.cityWisePlaces = action.payload;
  })
  .addCase(getPlacesCityWise.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

  /* -------- get Active Place cityWise -------- */
  builder
  .addCase(getActivePlacesCityWise.pending, (state) => {
    state.loading = true;
  })
  .addCase(getActivePlacesCityWise.fulfilled, (state, action) => {
    state.loading = false;
    state.cityWisePlaces = action.payload;
  })
  .addCase(getActivePlacesCityWise.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });



  
  }
})

export default placeSlice.reducer