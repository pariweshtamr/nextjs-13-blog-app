"use client"
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
  blogs: [],
  isLoading: false,
  selectedBlog: {},
}

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    requestPending: (state) => {
      state.isLoading = true
    },
    getBlogsSuccess: (state, { payload }) => {
      state.isLoading = false
      state.blogs = payload || []
    },
    getSelectedBlogSuccess: (state, { payload }) => {
      state.isLoading = false
      state.selectedBlog = payload || {}
    },
  },
})

const { actions, reducer } = blogSlice

export const { requestPending, getBlogsSuccess, getSelectedBlogSuccess } =
  actions

export default reducer
