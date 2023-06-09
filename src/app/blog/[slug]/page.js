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
import { useCallback, useEffect, useMemo, useState } from "react"
import { AiFillDelete, AiFillLike, AiOutlineLike } from "react-icons/ai"
import { BsFillPencilFill } from "react-icons/bs"
import { toast } from "react-toastify"
import { format } from "timeago.js"
import Comment from "@/components/comment/Comment"
import parse from "html-react-parser"
import { useDispatch, useSelector } from "react-redux"
import { getSingleBlogAction } from "@/app/redux/blog/blogAction"
import avatar from "/public/avatar.jpg"
import { sanitize } from "dompurify"
import BackButton from "@/components/backButton/BackButton"

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

  const handleComment = async (e) => {
    e.preventDefault()
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
      const { status, message } = await toggleLike({
        slug: post.slug,
        token: session?.user?.accessToken,
      })

      if (status === "Unauthorized") {
        toast.error(message)
        return
      }

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

  const fetchComments = useCallback(async () => {
    const cmnts = await getComments({
      slug: obj.params.slug,
    })

    setComments((prev) => cmnts)
  }, [obj.params.slug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  useEffect(() => {
    dispatch(getSingleBlogAction(obj.params.slug))
  }, [dispatch, obj.params.slug])

  const memoizedBlog = useMemo(() => selectedBlog, [selectedBlog])

  useEffect(() => {
    if (memoizedBlog) {
      setPost(memoizedBlog)
      setIsLiked(memoizedBlog?.likes?.includes(session?.user?._id))
      setPostLikes(memoizedBlog?.likes?.length || 0)
    }
  }, [memoizedBlog, session?.user?._id])

  let clean = sanitize(post?.content, {
    USE_PROFILES: { html: true },
  })

  return (
    <div className="min-h-[calc(100vh - 60px)] w-full">
      <div className="w-[85%] sm:w-[90%] h-full m-[0_auto] mt-[5rem] flex flex-col items-center">
        <div className="mx-0 justify-self-start self-start mb-5">
          <BackButton />
        </div>
        <div className="w-[800px] h-auto lg:w-full">
          {post?.imageUrl && (
            <Image
              src={post?.imageUrl}
              alt="post-img"
              width={800}
              height={650}
              className="object-cover mb-[2.5rem] w-full m-[0_auto]"
            />
          )}
        </div>
        <div className="p-[0_1rem] w-[800px] flex justify-between items-start mb-[2rem] lg:w-full">
          <h3 className="text-[36px] sm:text-[20px] md:text-[26px] lg:text-[32px] text-[#333] font-bold capitalize flex flex-col gap-4">
            {post?.title}
            <div className="flex gap-2">
              {post?.authorId?._id !== session?.user?._id && (
                <>
                  <p className="flex items-center gap-1 text-[14px] text-[#333]">
                    Written by:{" "}
                    <span className="font-[500] text-[#666] text-[14px]">
                      {post?.authorId?.username}
                    </span>
                  </p>
                  <p className="font-bold text-[14px] text-[#333]">|</p>
                </>
              )}
              <p className="font-bold text-[14px] text-[#666]">
                <span className="font-[500] text-[#666] text-[14px]">
                  {format(post?.createdAt)}
                </span>
              </p>
            </div>
          </h3>
          {post?.authorId?._id === session?.user?._id && (
            <div className="flex mt-3.5 h-full gap-5 sm:gap-3">
              <Link
                className="flex items-center outline-none border border-solid border-transparent text-[#000] cursor-pointer text-[18px] font-bold hover:text-[#3eda22]"
                href={`/blog/edit/${obj.params.slug}`}
              >
                <BsFillPencilFill className="text-[1.5rem] lg:text-xl md:text-sm" />
              </Link>
              <button
                className="outline-none border border-solid border-transparent text-[#000] flex items-center  cursor-pointer text-[18px] font-bold hover:text-[#f00]"
                onClick={handleDelete}
              >
                <AiFillDelete className="text-[1.5rem] lg:text-xl md:text-sm" />
              </button>
            </div>
          )}
        </div>

        <div className="p-[0_1rem] w-[800px] lg:w-full flex justify-between items-center mb-[3.75rem]">
          <div className="flex justify-start items-center gap-[1.25rem] text-[18px] sm:text-[16px] font-bold">
            Category:{" "}
            <span className="p-[0.3rem_1rem] sm:p-[.2rem_.8rem] bg-[#000] text-white rounded-full text-[16px] font-[500] sm:text-[12px]">
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

        <div className="p-[0_1rem] w-[800px] mb-[3.75rem] lg:w-full">
          <div className="">{parse(clean)}</div>
        </div>

        <div className="m-[0_auto] mt-[5rem] w-[800px] lg:w-full flex flex-col justify-center items-center border border-solid border-[#555] rounded-[20px]">
          <form
            onSubmit={handleComment}
            className="p-[1rem] w-full flex items-center gap-[1.5rem] border-b border-b-solid border-b-[#555]"
          >
            {session?.user ? (
              <Image
                src={
                  session?.user?.profileImg ? session?.user?.profileImg : avatar
                }
                width={50}
                height={50}
                alt="random-person"
                className="object-cover rounded-full sm:hidden"
              />
            ) : (
              ""
            )}

            <input
              type="text"
              value={commentText}
              placeholder="Type message..."
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 outline-none p-[0.25rem] border-b border-b-solid border-b-[#555]"
            />
            <button
              type="submit"
              className="outline-none border-none bg-[#d14201] text-white p-[0.25rem_0.75rem] rounded-[8px] text-[17px] cursor-pointer"
            >
              Post
            </button>
          </form>
          <div className="max-h-[300px] overflow-auto mt-[1.25rem] w-full p-[1rem] flex flex-col items-center gap-[2rem]">
            {!comments?.length ? (
              <h4 className="p-[1.25rem] sm:p-[1rem] text-[24px] sm:text-lg text-[#222]">
                No comments. Login and be the first one to leave a comment!
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
