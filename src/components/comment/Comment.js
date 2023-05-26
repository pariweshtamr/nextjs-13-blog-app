import { deleteComment } from "@/lib/axiosHelper"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { BsTrash } from "react-icons/bs"
import { format } from "timeago.js"
import person from "../../../public/devbw.png"
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
      <div className="w-[85%] h-full m-[0_auto] flex justify-between items-center">
        <div className="flex gap-[1.25rem]">
          <Image
            src={person}
            width={45}
            height={45}
            alt="profile-pic"
            className="w-[40px] h-[40px] object-cover rounded-1/2"
          />
          <div className="flex flex-col items-start gap-[.25rem]">
            <h4 className="">{comment?.authorId?.username}</h4>
            <span className="text-[15px] text-[#555]">
              {format(comment?.createdAt)}
            </span>
          </div>
          <span>{comment?.text}</span>
        </div>

        <div className="">
          {session?.user?._id === comment?.authorId?._id && (
            <BsTrash className="cursor-pointer" onClick={handleDeleteComment} />
          )}
        </div>
      </div>
    </div>
  )
}
export default Comment
