"use client"
import {
  addComment,
  deleteBlog,
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
import Comment from "@/components/comment/Comment"
import parse from "html-react-parser"
import { useDispatch, useSelector } from "react-redux"
import { getSingleBlogAction } from "@/app/redux/blog/blogAction"
import DOMPurify from "dompurify"

const BlogDetails = (obj) => {
  const dispatch = useDispatch()
  const { selectedBlog } = useSelector((state) => state.blog)
  const [post, setPost] = useState("")
  const [isLiked, setIsLiked] = useState("")
  const [postLikes, setPostLikes] = useState("")
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  const handleComment = async () => {
    if (commentText?.length < 2) {
      return toast.error("Comment must be more than 5 characters long!")
    }

    try {
      const { status, message, comment } = await addComment({
        slug: obj.params.slug,
        authorId: session?.user?._id,
        text: commentText,
        token: session?.user?.accessToken,
      })

      if (
        status === "error" &&
        message.includes("Request failed with status code 403")
      ) {
        toast.error("Please log in to give comments!")
        return
      } else if (status === "error") {
        toast.error(message)
      }

      toast[status](message) &&
        setComments((prev) => {
          return [...prev, comment]
        })

      setCommentText("")
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      const confirmModal = confirm("Are you sure you want to delete your blog?")

      if (confirmModal) {
        const { status, message } = await deleteBlog({
          slug: obj.params.slug,
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
        slug: post.slug,
        token: session?.user?.accessToken,
      })

      console.log(status)

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
        slug: obj.params.slug,
      })
      setComments(cmnts)
    }
    fetchComments()
  }, [])

  useEffect(() => {
    dispatch(getSingleBlogAction(obj.params.slug))
    setPost(selectedBlog)

    if (selectedBlog) {
      setIsLiked(selectedBlog?.likes?.includes(session?.user?._id))
      setPostLikes(selectedBlog?.likes?.length || 0)
    }
  }, [dispatch])

  let clean = DOMPurify.sanitize(selectedBlog?.content, {
    USE_PROFILES: { html: true },
  })

  return (
    <div className="min-h-[calc(100vh - 60px)] w-full">
      <div className="w-[85%] h-full m-[0_auto] mt-[5rem] flex flex-col items-center">
        <div className="w-[800px] h-auto">
          <Image
            src={selectedBlog?.imageUrl}
            alt="post-img"
            width={800}
            height={650}
            className="object-cover mb-[2.5rem] w-full m-[0_auto]"
          />
        </div>
        <div className="p-[0_1rem] w-[800px] flex justify-between items-center mb-[2rem]">
          <h3 className="text-[36px] text-[#333] font-bold capitalize">
            {selectedBlog?.title}
            <p className="font-bold text-[14px] text-[#666]">
              Published:{" "}
              <span className="font-[500] text-[#666] text-[14px]">
                {format(selectedBlog?.createdAt)}
              </span>
            </p>
          </h3>
          {selectedBlog?.authorId?._id === session?.user?._id ? (
            <div className="flex items-start h-full gap-5">
              <Link
                className="flex items-center outline-none border border-solid border-transparent text-[#000] cursor-pointer text-[18px] font-bold hover:text-[#3eda22]"
                href={`/blog/edit/${obj.params.slug}`}
              >
                <BsFillPencilFill size={24} />
              </Link>
              <button
                className="outline-none border border-solid border-transparent text-[#000] flex items-center  cursor-pointer text-[18px] font-bold hover:text-[#f00]"
                onClick={handleDelete}
              >
                <AiFillDelete size={24} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[.75rem] text-[20px] text-[#444]">
              Author: <span>{selectedBlog?.authorId?.username}</span>
            </div>
          )}
        </div>

        <div className="p-[0_1rem] w-[800px] flex justify-between items-center mb-[3.75rem]">
          <div className="flex justify-start items-center gap-[1.25rem] text-[18px] font-bold">
            Category:{" "}
            <span className="p-[0.5rem_1.25rem] bg-[#000] text-white rounded-full text-[16px] font-[500]">
              {selectedBlog?.category}
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

        <div className="p-[0_1rem] w-[800px] mb-[3.75rem]">
          <div className="">{parse(clean)}</div>
        </div>

        <div className="m-[0_auto] mt-[5rem] w-[800px] flex flex-col justify-center items-center border border-solid border-[#555] rounded-[20px]">
          <div className="p-[1rem] w-full flex items-center gap-[1.5rem] border-b border-b-solid border-b-[#555]">
            <Image
              src={session?.user?.profileImg}
              width={50}
              height={50}
              alt="random-person"
              className="object-cover rounded-full"
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
