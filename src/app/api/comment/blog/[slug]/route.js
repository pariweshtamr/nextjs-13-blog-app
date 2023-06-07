import dbConnect from "@/lib/db"
import User from "@/models/User"
import Blog from "@/models/Blog"
import Comment from "@/models/Comment"

export async function GET(req, obj) {
  await dbConnect()

  //   blog slug
  const slug = obj.params.slug

  // const accessToken = req.headers.get("authorization")

  // const decodedToken = verifyJwtToken(accessToken)

  // console.log(decodedToken)

  // if (!accessToken || !decodedToken) {
  //   return new Response(
  //     JSON.stringify({ error: "Unauthorized! wrong or expired token." }),
  //     { status: 403 }
  //   )
  // }
  try {
    const blog = await Blog.findOne({ slug })
    const comments = await Comment.find({ blogId: blog?._id }).populate(
      "authorId",
      User
    )

    return new Response(JSON.stringify(comments), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", error: error.message }),
      { status: 500 }
    )
  }
}
