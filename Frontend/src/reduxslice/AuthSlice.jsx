import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    doctor: null,
  },
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user.role === "doctor") {
        state.doctor = action.payload.user;
        state.user = null;
      } else {
        state.user = action.payload.user;
        state.doctor = null;
      }
    },
    // Called by axios interceptor when a new accessToken is issued
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.doctor = null;
    },
  },
});

export const { login, logout, setAccessToken } = AuthSlice.actions;
export default AuthSlice.reducer;
