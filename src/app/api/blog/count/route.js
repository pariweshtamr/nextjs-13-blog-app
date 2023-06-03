import dbConnect from "@/lib/db"
import Blog from "@/models/Blog"

export async function GET(req) {
  await dbConnect()

  try {
    const blogCount = await Blog.estimatedDocumentCount()

    return new Response(JSON.stringify({ status: "success", blogCount }))
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { status: 500 }
    )
  }
}
