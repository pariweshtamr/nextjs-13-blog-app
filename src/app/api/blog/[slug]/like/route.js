import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"
import { verifyJwtToken } from "@/lib/jwt"

export async function PUT(req, obj) {
  await dbConnect()
  const slug = obj.params.slug
  const accessToken = req.headers.get("authorization")

  const decodedToken = verifyJwtToken(accessToken)

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({
        status: "Unauthorized",
        message: "Please login to like or dislike the blog post!",
      })
    )
  }
  try {
    const blog = await Blog.findOne({ slug })

    if (blog?.likes?.includes(decodedToken._id)) {
      blog.likes = blog?.likes?.filter(
        (id) => id.toString() !== decodedToken._id.toString()
      )
    } else {
      blog?.likes?.push(decodedToken._id)
    }
    await blog.save()

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully interacted with the blog!",
      }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}
