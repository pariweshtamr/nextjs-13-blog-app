"use client"
const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
  user: {},
  isLoading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestPending: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, { payload }) => {
      state.isLoading = false
      state.user = payload || {}
    },
    getUserSuccess: (state, { payload }) => {
      state.isLoading = false
      state.user = payload
    },
  },
})

const { actions, reducer } = userSlice

export const { requestPending, loginSuccess, getUserSuccess } = actions

export default reducer
