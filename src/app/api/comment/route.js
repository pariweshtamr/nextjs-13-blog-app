import dbConnect from "@/lib/db"
import { verifyJwtToken } from "@/lib/jwt"
import Comment from "@/models/Comment"

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

    let newComment = await Comment.create(body)
    newComment = await newComment.populate("authorId")

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
