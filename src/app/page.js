"use client"
import BlogCard from "@/components/blogCard/BlogCard"
import { getAllBlogs } from "@/lib/axiosHelper"
import { useEffect, useState } from "react"

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await getAllBlogs()
      setPosts(blogs)
    }
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-[calc(100vh - 60px)] w-full">
      <h2 className="text-center text-[#333] mt-[1.5rem] text-[32px]">Blogs</h2>
      <div className="h-full w-[85%] m-[0_auto] mt-[2.5rem] flex flex-wrap gap-[5rem]">
        {posts?.length ? (
          posts?.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <h3 className="">No blogs found!</h3>
        )}
      </div>
    </div>
  )
}
