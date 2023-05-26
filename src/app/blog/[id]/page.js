"use client"
import {
  addComment,
  deleteBlog,
  getBlog,
  getComments,
  toggleLike,
} from "@/lib/axiosHelper"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiFillDelete, AiFillLike, AiOutlineLike } from "react-icons/ai"
import { BsFillPencilFill } from "react-icons/bs"
import { toast } from "react-toastify"
import { format } from "timeago.js"
import person from "../../../../public/devbw.png"
import Comment from "@/components/comment/Comment"
import DOMPurify from "dompurify"
import parse from "html-react-parser"

const BlogDetails = (obj) => {
  const [post, setPost] = useState("")
  const [isLiked, setIsLiked] = useState("")
  const [postLikes, setPostLikes] = useState("")
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  const fetchBlogs = async () => {
    const { status, blog } = await getBlog(obj.params.id)
    if (status === "success") {
      setPost(blog)
      setIsLiked(blog?.likes?.includes(session?.user?._id))
      setPostLikes(blog?.likes?.length || 0)
    }
  }

  const handleComment = async () => {
    if (commentText?.length < 2) {
      return toast.error("Comment must be more than 5 characters long!")
    }

    try {
      const { status, message, comment } = await addComment({
        blogId: obj.params.id,
        authorId: session?.user?._id,
        text: commentText,
        token: session?.user?.accessToken,
      })

      if (status !== "success") {
        return toast.error(message)
      }
      toast[status](message) &&
        setComments((prev) => {
          return [...prev, comment]
        })

      setCommentText("")
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      const confirmModal = confirm("Are you sure you want to delete your blog?")

      if (confirmModal) {
        const { status, message } = await deleteBlog({
          id: obj.params.id,
          token: session?.user?.accessToken,
        })

        status && toast[status](message)

        if (status === "success") {
          router.push("/")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLike = async () => {
    try {
      const { status } = await toggleLike({
        id: post._id,
        token: session?.user?.accessToken,
      })

      if (status === "success") {
        if (isLiked) {
          setIsLiked((prev) => !prev)
          setPostLikes((prev) => prev - 1)
        } else {
          setIsLiked((prev) => !prev)
          setPostLikes((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      const cmnts = await getComments({
        id: obj.params.id,
        token: session?.user?.accessToken,
      })
      setComments(cmnts)
    }
    fetchComments()
  }, [session])

  useEffect(() => {
    session && fetchBlogs()
  }, [session])

  let clean = DOMPurify.sanitize(post?.content, {
    USE_PROFILES: { html: true },
  })

  return (
    <div className="min-h-[calc(100vh - 60px)] w-full">
      <div className="w-[85%] h-full m-[0_auto] mt-[5rem] flex flex-col items-center">
        <Image
          src={post?.imageUrl}
          alt="post-img"
          width={750}
          height={650}
          className="object-cover mb-[2.5rem]"
        />
        <div className="p-[0_1rem] w-[750px] flex justify-between items-center mb-[3.75rem]">
          <h3 className="text-[36px] text-[#333] capitalize">{post?.title}</h3>
          {post?.authorId?._id === session?.user?._id ? (
            <div className="flex items-center gap-[1rem]">
              <Link
                className="flex items-center gap-[.75rem] outline-none border border-solid border-transparent bg-[#3eda22] text-[#fff] p-[0.5rem_1.25rem] rounded-[12px] cursor-pointer text-[18px] font-bold transition-[150ms] hover:bg-[#fff] hover:border-[#3eda22] hover:text-[#3eda22]"
                href={`/blog/edit/${obj.params.id}`}
              >
                Edit <BsFillPencilFill />
              </Link>
              <button
                className="outline-none border border-solid border-transparent bg-[#f00] text-[#fff] p-[.5rem_1.25rem] flex gap-[.75rem] items-center rounded-[12px] cursor-pointer text-[18px] font-bold transition-[150ms] hover:bg-[#fff] hover:border-[#f00] hover:text-[#f00]"
                onClick={handleDelete}
              >
                Delete <AiFillDelete />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[.75rem] text-[20px] text-[#444]">
              Author: <span>{post?.authorId?.username}</span>
            </div>
          )}
        </div>

        <div className="p-[0_1rem] w-[750px] flex justify-between items-center mb-[3.75rem]">
          <div className="flex justify-start items-center gap-[1.25rem] text-[18px] font-bold">
            Category:{" "}
            <span className="p-[0.5rem_1.25rem] bg-[#3eda22] text-white rounded-[12px] text-[16px] font-[500]">
              {post?.category}
            </span>
          </div>
          <div className="flex items-center gap-[1rem] cursor-pointer">
            {postLikes}{" "}
            {isLiked ? (
              <AiFillLike size={20} onClick={handleLike} />
            ) : (
              <AiOutlineLike size={20} onClick={handleLike} />
            )}
          </div>
        </div>

        <div className="p-[0_1rem] w-[750px] flex justify-between items-center mb-[3.75rem]">
          <p className="">{parse(clean)}</p>
          <span className="font-bold">
            Posted:{" "}
            <span className="font-[500] text-[#666] text-[15px]">
              {format(post?.createdAt)}
            </span>
          </span>
        </div>

        <div className="m-[0_auto] mt-[5rem] w-1/2 flex flex-col justify-center items-center border border-solid border-[#555] rounded-[20px]">
          <div className="p-[1rem] w-full flex items-center gap-[1.5rem] border-b border-b-solid border-b-[#555]">
            <Image
              src={person}
              width={45}
              height={45}
              alt="random-person"
              className="object-cover rounded-1/2"
            />
            <input
              type="text"
              value={commentText}
              placeholder="Type message..."
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 outline-none p-[0.25rem] border-b border-b-solid border-b-[#555]"
            />
            <button
              onClick={handleComment}
              className="outline-none border-none bg-[#0707b5] text-white p-[0.25rem_0.75rem] rounded-[8px] text-[17px] cursor-pointer"
            >
              Post
            </button>
          </div>
          <div className="max-h-[300px] overflow-auto mt-[1.25rem] w-full p-[1rem] flex flex-col items-center gap-[2rem]">
            {!comments?.length ? (
              <h4 className="p-[1.25rem] text-[24px] text-[#222]">
                No comments. Be the first one to leave a comment!
              </h4>
            ) : (
              comments?.map((comment) => (
                <Comment
                  key={comment?._id}
                  comment={comment}
                  setComments={setComments}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default BlogDetails
