import axios from "axios"

const apiRootUrl = "/api"
const userEp = apiRootUrl + "/user"
const registerEp = apiRootUrl + "/register"
const blogEp = apiRootUrl + "/blog"
const commentEp = apiRootUrl + "/comment"

export const axiosProcessor = async ({
  url,
  method,
  isPrivate,
  token,
  objData,
}) => {
  try {
    const { data } = await axios({
      method,
      url,
      data: objData,
      headers: isPrivate ? { Authorization: token } : null,
    })
    return data
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// user register
export const registerUser = async (objData) => {
  try {
    const obj = {
      method: "POST",
      url: registerEp,
      objData,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// get user
export const getUser = async (id) => {
  try {
    const obj = {
      method: "GET",
      url: `${userEp}/${id}`,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// update password
export const updatePassword = async (obj) => {
  const { id, token, ...rest } = obj
  try {
    const obj = {
      method: "PATCH",
      url: `${userEp}/${id}`,
      objData: rest,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// post a blog
export const createPost = async (objData) => {
  const { token, ...rest } = objData

  try {
    const obj = {
      method: "POST",
      url: blogEp,
      objData: rest,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// get all blogs
export const getAllBlogs = async () => {
  try {
    const obj = {
      method: "GET",
      url: blogEp,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

export const getBlogCount = async () => {
  try {
    const obj = {
      method: "GET",
      url: blogEp + "/count",
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// get a blog
export const getBlog = async (slug) => {
  try {
    const obj = {
      method: "GET",
      url: `${blogEp}/${slug}`,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// get user's blogs
export const getUserBlogs = async (id) => {
  console.log(id)
  try {
    const obj = {
      method: "GET",
      url: `${blogEp}/user/${id}`,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// like or unlike a blog
export const toggleLike = async (objData) => {
  const { slug, token } = objData
  try {
    const obj = {
      method: "PUT",
      url: `${blogEp}/${slug}/like`,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// edit blog
export const editBlog = async (objData) => {
  const { slug, token, ...rest } = objData

  try {
    const obj = {
      method: "PUT",
      url: `${blogEp}/${slug}`,
      objData: rest,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// delete a blog
export const deleteBlog = async ({ slug, token }) => {
  try {
    const obj = {
      method: "DELETE",
      url: `${blogEp}/${slug}`,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// get comments
export const getComments = async ({ slug }) => {
  try {
    const obj = {
      method: "GET",
      url: `${commentEp}/blog/${slug}`,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// add comment
export const addComment = async (objData) => {
  const { token, ...rest } = objData
  try {
    const obj = {
      method: "POST",
      url: commentEp,
      objData: rest,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

// delete comment
export const deleteComment = async ({ id, token }) => {
  try {
    const obj = {
      method: "DELETE",
      url: `${commentEp}/${id}`,
      isPrivate: true,
      token,
    }
    return await axiosProcessor(obj)
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}
