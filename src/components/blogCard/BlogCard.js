"use client"
import { toggleLike } from "@/lib/axiosHelper"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AiFillLike, AiOutlineLike } from "react-icons/ai"
import parse from "html-react-parser"
import DOMPurify from "dompurify"
import avatar from "../../../public/avatar.jpg"
import { motion } from "framer-motion"

const BlogCard = ({ blog }) => {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [blogLikes, setBlogLikes] = useState(0)

  const handleLike = async () => {
    try {
      const { status } = await toggleLike({
        slug: blog.slug,
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

  let clean = DOMPurify.sanitize(blog?.content, {
    USE_PROFILES: { html: true },
  })

  useEffect(() => {
    session &&
      blog?.likes &&
      setIsLiked(blog?.likes?.includes(session?.user?._id))
    session && blog?.likes && setBlogLikes(blog?.likes.length)
  }, [blog?.likes, session])

  const card = {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delayChildren: 0.5, staggerChildre: -1 },
    },
  }

  return (
    <motion.div
      variants={card}
      initial="hidden"
      animate="show"
      className="w-[full] min-h-[550px] shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.3)] transition-[150ms] rounded-lg hover:shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.4)] md:min-h-[500px]"
    >
      <div className="p-[.8rem] w-full h-full flex flex-col gap-3 min-xl:min-h-[45rem]">
        <Link className="h-1/2" href={`/blog/${blog.slug}`}>
          {blog?.imageUrl && (
            <Image
              src={blog?.imageUrl}
              alt="blog-img"
              width={350}
              height={350}
              className="object-cover rounded-md w-full h-full hover:shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.6)]"
            />
          )}
        </Link>

        <div className="h-1/2 flex flex-col justify-between px-4 pb-4 md:justify-around">
          <p className="text-[#6E778B]">{blog?.category}</p>

          <h3 className="text-[20px] font-bold">{blog?.title}</h3>

          <div className="text-[#666] overflow-hidden text-ellipsis block blog-card">
            {parse(clean)}
          </div>

          <div className="flex justify-between justify-self-end">
            <div className="flex gap-3">
              <div className="rounded-full border border-solid border-[#1D2031] p-[2px] w-[50px] h-[50px]">
                <Image
                  src={
                    blog?.authorId?.profileImg
                      ? blog?.authorId?.profileImg
                      : avatar
                  }
                  alt="profile-img"
                  width={1920}
                  height={1920}
                  className="object-cover rounded-full shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.6)] w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <h5 className="font-bold">{blog?.authorId?.username}</h5>
                <p className="text-[#6E778B] text-[12px]">
                  {new Date(blog?.createdAt)
                    .toDateString()
                    .split(" ")
                    .slice(1)
                    .join(" ")}
                </p>
              </div>
            </div>

            <div className="text-[20px] cursor-pointer flex items-center gap-[0.5rem]">
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
    </motion.div>
  )
}
export default BlogCard
