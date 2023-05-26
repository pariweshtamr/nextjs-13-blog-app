import { hashPassword } from "@/lib/bcrypt"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(req) {
  try {
    await dbConnect()
    const { username, email, profileImg, password: pass } = await req.json()

    const isExisting = await User.findOne({ email })

    if (isExisting) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "User already exists",
        })
      )
    }

    const hashedPassword = hashPassword(pass)
    const newUser = await User.create({
      username,
      email,
      profileImg,
      password: hashedPassword,
    })

    //  ._doc -> the values of the user
    const { password, __v, ...user } = newUser._doc

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Registration successful",
        user,
      }),
      { status: 201 }
    )
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 })
  }
}
