import { createSlice } from '@reduxjs/toolkit';
import { getCookie, getCookies, setCookie } from 'cookies-next';

const initialState = {
  user: getCookies('user') || null, // Read user from cookie
  token: getCookie('token') || null, // Read token from cookie
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('Login action payload:', action.payload); // Debugging
      state.user = action.payload.user; // Set the user
      state.token = action.payload.token; // Set the token

      // Set cookies
      setCookie('user', action.payload.user); // Store user in cookie
      setCookie('token', action.payload.token); // Store token in cookie
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      // Clear cookies
      removeCookie('user');
      removeCookie('token');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
