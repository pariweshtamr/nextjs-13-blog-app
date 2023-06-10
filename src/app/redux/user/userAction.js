import { getUser, updatePassword } from "@/lib/axiosHelper"
import { getUserSuccess, requestPending } from "./userSlice"
import { toast } from "react-toastify"

export const getUserAction = (id) => async (dispatch) => {
  try {
    const { status, user } = await getUser(id)

    status === "success"
      ? dispatch(getUserSuccess(user))
      : dispatch(getUserSuccess())
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    }
  }
}

export const updatePasswordAction = (obj) => async (dispatch) => {
  try {
    dispatch(requestPending())

    const { status, message, updatedUser } = await updatePassword(obj)

    status === "success"
      ? dispatch(getUserSuccess(updatedUser)) && toast[status](message)
      : dispatch(getUserSuccess()) && toast[status](message)
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    }
  }
}
