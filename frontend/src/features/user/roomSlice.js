import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../pages/services/apiClient";

const initialState = {
  rooms: [],
  loading: false,
  error: null,
  createSuccess: false,
  room: null
}

/* -------- Create room -------- */
export const createRoom = createAsyncThunk("room/createRoom", async (data, thunkAPI) => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const response = await apiClient.post("/api/room/create-room",data, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "multipart/form-data",
      }
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Create room failed"
    );
  }
})

/* -------- getAllRoomsByID -------- */
export const getAllRoomsByID = createAsyncThunk("room/getAllRoomsBYID", async (hotelId, thunkAPI) => {
  try {
    const adminToken = localStorage.getItem("adminToken");
    const response = await apiClient.get(`/api/room/admin/rooms/${hotelId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })
    return response.data; // important
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch rooms"
    );
  }
})

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    /* -------- Create room -------- */
    builder
    .addCase(createRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(createRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.createSuccess = true;
      state.rooms.push(action.payload.data);
    })

    .addCase(createRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  /* -------- getAllRoomsByID -------- */
  builder
  .addCase(getAllRoomsByID.pending, (state) => {
    state.loading = true;
  })

  .addCase(getAllRoomsByID.fulfilled, (state, action) => {
    state.loading = false;
    state.rooms = action.payload;
  })

  .addCase(getAllRoomsByID.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });  


  }
})

export default roomSlice.reducer;