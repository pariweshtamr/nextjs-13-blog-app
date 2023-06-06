import { deleteComment } from "@/lib/axiosHelper"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { BsTrash } from "react-icons/bs"
import { format } from "timeago.js"
import { toast } from "react-toastify"

const Comment = ({ comment, setComments }) => {
  const { data: session } = useSession()

  const handleDeleteComment = async () => {
    try {
      const { status, message } = await deleteComment({
        id: comment?._id,
        token: session?.user?.accessToken,
      })

      if (status === "success") {
        toast[status](message)
        setComments((prev) => {
          return [...prev].filter((c) => c?._id !== comment?._id)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-full w-full">
      <div className="w-[85%] sm:w-full h-full m-[0_auto] flex justify-between items-center">
        <div className="flex gap-[1.25rem]">
          <Image
            src={session?.user?.profileImg}
            width={50}
            height={50}
            alt="profile-pic"
            className="w-[50px] h-[50px] object-cover rounded-full self-center sm:hidden"
          />
          <div className="flex flex-col items-start gap-[.25rem]">
            <h4 className="sm:text-[12px]">{comment?.authorId?.username}</h4>
            <span className="text-[15px] text-[#555] sm:text-[10px]">
              {format(comment?.createdAt)}
            </span>
          </div>
          <span>{comment?.text}</span>
        </div>

        <div>
          {session?.user?._id === comment?.authorId?._id && (
            <BsTrash className="cursor-pointer" onClick={handleDeleteComment} />
          )}
        </div>
      </div>
    </div>
  )
}
export default Comment
