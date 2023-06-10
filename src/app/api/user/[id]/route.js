import { comparePassword, hashPassword } from "@/lib/bcrypt"
import dbConnect from "@/lib/db"
import { verifyJwtToken } from "@/lib/jwt"
import User from "@/models/User"

export async function GET(req, obj) {
  await dbConnect()
  const id = obj.params.id

  try {
    const user = await User.findById(id).select("-password, -__v")

    return new Response(JSON.stringify({ status: "success", user }))
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}

export async function PATCH(req, obj) {
  await dbConnect()
  const id = obj.params.id

  const accessToken = req.headers.get("authorization")
  const decodedToken = verifyJwtToken(accessToken)
  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Unauthorized! wrong or expired token.",
      }),
      { status: 403 }
    )
  }

  const body = await req.json()
  const { currentPassword, password } = body
  try {
    const user = await User.findById(id)

    if (!user?._id) {
      return new Response(
        JSON.stringify({ status: "error", message: "User not found!" })
      )
    }

    const isPassMatched = comparePassword(currentPassword, user?.password)

    if (isPassMatched) {
      const hashedPass = hashPassword(password)

      const updatedUser = await User.findByIdAndUpdate(user?._id, {
        password: hashedPass,
      })

      if (updatedUser?._id) {
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Password updated successfully!",
          })
        )
      }
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Unable to update your password. Please try again later!",
        })
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}
