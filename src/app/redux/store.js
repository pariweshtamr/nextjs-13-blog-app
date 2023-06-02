"use client"
import { configureStore } from "@reduxjs/toolkit"
import blogReducer from "./blog/blogSlice"
import userReducer from "./user/userSlice"

const store = configureStore({
  reducer: {
    blog: blogReducer,
    user: userReducer,
  },
})

export default store
