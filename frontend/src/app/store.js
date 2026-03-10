import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import superAdminAuthReducer from "../features/auth/superAdminAuthSlice";
import searchReducer from '../features/user/searchSlice'
import superAdminReducer from "../features/user/superAdminSlice";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import adminReducer from "../features/user/adminSlice";


export const store = configureStore({
  reducer:{
    auth: authReducer,
    user: userReducer,
    superAdminAuth: superAdminAuthReducer,
    superAdmin: superAdminReducer,
    adminAuth: adminAuthReducer,
    admin: adminReducer,
    search : searchReducer
  }
})