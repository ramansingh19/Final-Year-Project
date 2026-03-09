import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import searchReducer from '../features/user/searchSlice'

export const store = configureStore({
  reducer:{
    auth: authReducer,
    user: userReducer ,
    search : searchReducer
  }
})