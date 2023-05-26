import dbConnect from "@/lib/db"
import { verifyJwtToken } from "@/lib/jwt"
import Blog from "@/models/Blog"

export async function GET(req, obj) {
  await dbConnect()
  const id = obj.params.id
  try {
    const blog = await Blog.findById(id)
      .populate("authorId")
      .select("-password")

    return new Response(JSON.stringify({ status: "success", blog }), {
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 500 })
  }
}

export async function PUT(req, obj) {
  await dbConnect()
  const id = obj.params.id

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

    const blog = await Blog.findById(id).populate("authorId")

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
      id,
      { $set: { ...body } },
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
  const id = obj.params.id
  const accessToken = req.headers.get("authorization")

  const decodedToken = verifyJwtToken(accessToken)

  if (!accessToken || !decodedToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized! wrong or expired token." }),
      { status: 403 }
    )
  }

  try {
    const blog = await Blog.findById(id).populate("authorId")

    if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({ msg: "Only the author can delete the blog!" }),
        { status: 403 }
      )
    }

    await Blog.findByIdAndDelete(id)
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
