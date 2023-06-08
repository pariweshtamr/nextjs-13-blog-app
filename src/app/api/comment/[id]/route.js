import dbConnect from "@/lib/db"
import Comment from "@/models/Comment"
import { verifyJwtToken } from "@/lib/jwt"

export async function DELETE(req, obj) {
  await dbConnect()

  //   blog id
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
    const comment = await Comment.findById(id).populate({
      path: "authorId",
      select: "-password, -__v",
      model: User,
    })
    if (comment.authorId._id.toString() !== decodedToken._id.toString()) {
      return new Response(
        JSON.stringify({ msg: "Only the author can delete the comment!" }),
        { status: 401 }
      )
    }

    await Comment.findByIdAndDelete(id)

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully deleted commment!",
      }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", error: error.message }),
      { status: 500 }
    )
  }
}
