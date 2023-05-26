"use client"
import { toggleLike } from "@/lib/axiosHelper"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"

const BlogCard = ({ blog }) => {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [blogLikes, setBlogLikes] = useState(0)

  const handleLike = async () => {
    try {
      const { status } = await toggleLike({
        id: blog._id,
        token: session?.user?.accessToken,
      })

      if (status === "success") {
        if (isLiked) {
          setIsLiked((prev) => !prev)
          setBlogLikes((prev) => prev - 1)
        } else {
          setIsLiked((prev) => !prev)
          setBlogLikes((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    session &&
      blog?.likes &&
      setIsLiked(blog?.likes?.includes(session?.user?._id))
    session && blog?.likes && setBlogLikes(blog?.likes.length)
  }, [blog?.likes, session])

  return (
    <div className="w-[23%] h-[400px] shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.15)] transition-[150ms] rounded-xl hover:shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.4)]">
      <div className="p-[.8rem] w-full h-full flex flex-col">
        <Link className="" href={`/blog/${blog._id}`}>
          <Image
            src={blog?.imageUrl}
            alt="blog-img"
            width={350}
            height={350}
            className="object-cover rounded-[20px] w-full m-[0_auto] "
          />
        </Link>
        <div className="flex justify-between items-center">
          <div className="">
            <h3 className="text-[28px] font-bold mt-[1.5rem] mb-[1.25rem]">
              {blog?.title}
            </h3>
            <p className="text-[#666]">{blog?.desc}</p>
            <span className="mt-[2rem] flex items-center gap-[0.5rem] text-[15px]">
              Created By: <span className="text-[#777]">1st of January</span>{" "}
            </span>
          </div>
          <div className="text-[24px] cursor-pointer flex items-center gap-[0.5rem]">
            {blogLikes || 0}{" "}
            {isLiked ? (
              <AiFillLike size={20} onClick={handleLike} />
            ) : (
              <AiOutlineLike size={20} onClick={handleLike} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default BlogCard
