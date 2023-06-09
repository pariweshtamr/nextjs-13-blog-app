import { getUser } from "@/lib/axiosHelper"
import { getUserSuccess } from "./userSlice"

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
