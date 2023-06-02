import { editBlog, getAllBlogs, getBlog } from "@/lib/axiosHelper"

import {
  getBlogsSuccess,
  getSelectedBlogSuccess,
  requestPending,
} from "./blogSlice"
import { toast } from "react-toastify"

export const getAllBlogsAction = () => async (dispatch) => {
  try {
    dispatch(requestPending())

    const { status, blogs } = await getAllBlogs()

    status === "success"
      ? dispatch(getBlogsSuccess(blogs))
      : dispatch(getBlogsSuccess())
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    }
  }
}

export const getSingleBlogAction = (slug) => async (dispatch) => {
  try {
    dispatch(requestPending())

    const { status, blog } = await getBlog(slug)

    status === "success"
      ? dispatch(getSelectedBlogSuccess(blog))
      : dispatch(getSelectedBlogSuccess())
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    }
  }
}

export const editBlogAction = (obj) => async (dispatch) => {
  try {
    dispatch(requestPending())
    const { status, message, blog } = await editBlog(obj)

    status === "success"
      ? dispatch(getSelectedBlogSuccess(blog)) && toast[status](message)
      : dispatch(getSelectedBlog()) && toast[status](message)
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    }
  }
}
