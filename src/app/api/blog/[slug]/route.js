import dbConnect from "@/lib/db"
import User from "@/models/User"
import Blog from "@/models/Blog"
import DOMPurify from "isomorphic-dompurify"
import { verifyJwtToken } from "@/lib/jwt"

export async function GET(req, obj) {
  await dbConnect()
  const slug = obj.params.slug

  try {
    const blog = await Blog.findOne({ slug }).populate({
      path: "authorId",
      select: "-password",
      model: User,
    })

    return new Response(JSON.stringify({ status: "success", blog }), {
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: "Unable to fetch blog!" }),
      { status: 500 }
    )
  }
}

export async function PUT(req, obj) {
  await dbConnect()
  const slug = obj.params.slug

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
    const { cleanContent, ...rest } = body
    const content = DOMPurify.sanitize(cleanContent)

    const blog = await Blog.findOne({ slug }).populate({
      path: "authorId",
      select: "-password, -__v",
      model: User,
    })

    if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Only author can update this blog!",
        }),
        { status: 403 }
      )
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blog?._id,
      { $set: { ...rest, content } },
      { new: true }
    )

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Blog post updated successfully!",
        blog: updatedBlog,
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

export async function DELETE(req, obj) {
  await dbConnect()
  const slug = obj.params.slug
  const accessToken = req.headers.get("authorization")

  const decodedToken = verifyJwtToken(accessToken)

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized! wrong or expired token." }),
      { status: 403 }
    )
  }

  try {
    const blog = await Blog.findOne({ slug }).populate({
      path: "authorId",
      select: "-password, -__v",
      model: User,
    })

    if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({ msg: "Only the author can delete the blog!" }),
        { status: 403 }
      )
    }

    await Blog.findOneAndDelete({ slug })
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully deleted blog!",
      }),
      {
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}
