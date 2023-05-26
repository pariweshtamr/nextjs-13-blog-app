import dbConnect from "@/lib/db"
import { verifyJwtToken } from "@/lib/jwt"
import Blog from "@/models/Blog"

export async function GET(req) {
  await dbConnect()

  try {
    const blogs = await Blog.find({}).limit(16).populate("authorId")
    return new Response(JSON.stringify(blogs), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 })
  }
}

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
    const newBlog = await Blog.create(body)

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Blog post created!",
        blog: newBlog,
      }),
      { status: 201 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}
