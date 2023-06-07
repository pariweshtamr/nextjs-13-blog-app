import dbConnect from "@/lib/db"
import User from "@/models/User"
import Blog from "@/models/Blog"
import Comment from "@/models/Comment"
import { verifyJwtToken } from "@/lib/jwt"

export async function POST(req) {
  await dbConnect()

  const accessToken = req.headers.get("authorization")

  const decodedToken = verifyJwtToken(accessToken)

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized! wrong or expired token." }),
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const { slug, ...rest } = body
    const blog = await Blog.findOne({ slug })

    let newComment = await Comment.create({ blogId: blog?._id, ...rest })
    newComment = await newComment.populate("authorId", User)

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Comment added!",
        comment: newComment,
      }),
      { status: 201 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", error: error.message }),
      { status: 500 }
    )
  }
}
