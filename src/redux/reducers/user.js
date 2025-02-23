import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem('user'));
const storedToken = localStorage.getItem('token');

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser || null,
    token: storedToken || null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    }
  }
});

export const { setUser, setToken, clearUser } = userSlice.actions;
export default userSlice.reducer; 