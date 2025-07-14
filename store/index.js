import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Example slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
