"use client"
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
  blogs: [],
  blogCount: 0,
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
    getCount: (state, { payload }) => {
      state.isLoading = false
      state.blogCount = payload
    },
  },
})

const { actions, reducer } = blogSlice

export const {
  requestPending,
  getBlogsSuccess,
  getSelectedBlogSuccess,
  getCount,
} = actions

export default reducer
