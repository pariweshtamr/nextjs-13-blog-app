import dbConnect from "@/lib/db"
import { verifyJwtToken } from "@/lib/jwt"
import Blog from "@/models/Blog"
import slugify from "slugify"
import DOMPurify from "isomorphic-dompurify"

export async function GET(req) {
  await dbConnect()

  try {
    const blogs = await Blog.find({}).limit(16).populate("authorId")
    return new Response(
      JSON.stringify({ count: blogs.length, status: "success", blogs })
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
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
    const { cleanContent, title } = body
    const content = DOMPurify.sanitize(cleanContent)
    const slug = slugify(title, { lower: true })

    const blogExists = await Blog.findOne({ slug })

    if (blogExists?._id) {
      return new Response(
        JSON.stringify({
          status: "error",
          message:
            "A blog post with the same name already exists in our system!",
        })
      )
    }

    const newBlog = await Blog.create({ ...body, content, slug })

    if (!newBlog._id) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Unable to create blog post!",
        })
      )
    }

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
