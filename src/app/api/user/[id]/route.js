import dbConnect from "@/lib/db"
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
