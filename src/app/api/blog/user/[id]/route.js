import dbConnect from "@/lib/db"
import User from "@/models/User"
import Blog from "@/models/Blog"

export async function GET(req, obj) {
  await dbConnect()

  const authorId = obj?.params?.id

  try {
    const blogs = await Blog.find({ authorId })
      .limit(16)
      .populate({ path: "authorId", select: "-password, -__v", model: User })

    return new Response(JSON.stringify({ status: "success", blogs }))
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}
