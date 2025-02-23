import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./reducers/movies";
import userReducer from "./reducers/user";

// Create the store
export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer
    // We'll add more reducers here later
  },
  devTools: process.env.NODE_ENV !== 'production'
});
