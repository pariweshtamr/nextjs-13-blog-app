"use client"
import BlogCard from "@/components/blogCard/BlogCard"
import { getAllBlogsAction } from "@/app/redux/blog/blogAction"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loader from "@/components/loader/Loader"
import Link from "next/link"
import Image from "next/image"
import Pagination from "@/components/pagination/Pagination"
import { paginate } from "@/lib/paginate"

const Home = () => {
  const dispatch = useDispatch()
  const { blogs, isLoading } = useSelector((state) => state.blog)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 6

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    dispatch(getAllBlogsAction())
  }, [dispatch])

  const memoizedPosts = useMemo(() => blogs, [blogs])

  useEffect(() => {
    setPosts(memoizedPosts)
  }, [memoizedPosts])

  const sortedPosts = [...posts]?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const paginatedPosts = paginate(sortedPosts, currentPage, pageSize)

  return (
    <div className="min-h-[calc(100vh - 60px)] w-full">
      {isLoading ? (
        <div className="h-full">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col bg-[#FCF6ED] bg-[url('https://www.transparenttextures.com/patterns/xv.png')] bg relative">
            <div className="absolute z-[0] -left-[22rem] top-[4.5rem] w-[65%] h-[65%] bg-white border-2 border-solid border-[#000] rounded-full rotate-[22deg]"></div>
            <p className="text-center mt-[1rem]">Blogs</p>
            <h1 className="text-center text-[#333] text-[3.5rem] font-bold">
              Stories & ideas
            </h1>
            <p className="text-[#6E778B] text-center">
              The latest news about the tech world.
            </p>
            <div className="flex gap-2.5 w-[70%] m-[0_auto] my-[2.5rem] mb-[5rem] min-h-[60vh] z-10">
              <div className="w-1/2 h-full">
                {sortedPosts?.length &&
                  sortedPosts.slice(0, 1).map((post) => (
                    <div
                      className="p-3 border-2 border-solid border-[#1D2031] rounded-lg flex flex-col h-full bg-white"
                      key={post._id}
                    >
                      <Link className="flex-2" href={`/blog/${post.slug}`}>
                        {post?.imageUrl && (
                          <Image
                            src={post?.imageUrl}
                            alt="blog-img"
                            width={350}
                            height={350}
                            className="object-cover rounded-lg w-full h-full shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.6)]"
                          />
                        )}
                      </Link>
                      <div className="flex-1 px-5 pb-4 pt-6 flex flex-col justify-between">
                        <div className="bg-[#000] text-white w-max px-3 py-1 rounded-full text-sm">
                          {post.category}
                        </div>

                        <h3 className="font-bold text-[1D2031] text-[2rem]">
                          {post.title}
                        </h3>

                        <div className="flex gap-3">
                          <div className="rounded-full border border-solid border-[#1D2031] p-[2px] w-max">
                            <Image
                              src={post.authorId.profileImg}
                              alt="profile-img"
                              width={60}
                              height={60}
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex flex-col justify-center gap-1">
                            <h5 className="font-bold">
                              {post.authorId.username}
                            </h5>
                            <p className="text-[#6E778B] text-[12px]">
                              {new Date(post.createdAt)
                                .toDateString()
                                .split(" ")
                                .slice(1)
                                .join(" ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="w-1/2 min-h-[60vh] flex flex-col justify-around">
                {sortedPosts?.length &&
                  sortedPosts?.slice(1, 4).map((post) => (
                    <div className="flex flex-col p-3" key={post._id}>
                      <div className="flex gap-6 h-[10.8rem]">
                        <Link className="" href={`/blog/${post.slug}`}>
                          {post?.imageUrl && (
                            <Image
                              src={post?.imageUrl}
                              alt="blog-img"
                              width={240}
                              height={240}
                              className="object-cover rounded-lg h-full"
                            />
                          )}
                        </Link>

                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div className="bg-[#000] text-white w-max px-2.5 py-1 rounded-full text-xs">
                            {post.category}
                          </div>
                          <h3 className="font-bold text-[1D2031] text-[1.1rem]">
                            {post.title}
                          </h3>

                          <div className="flex gap-3">
                            <div className="rounded-full border border-solid border-[#333] p-[2px] w-max h-max">
                              <Image
                                src={post.authorId.profileImg}
                                alt="profile-img"
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                              <h5 className="font-bold text-[14px]">
                                {post.authorId.username}
                              </h5>
                              <p className="text-[12px] text-[#6E778B]">
                                {new Date(post.createdAt)
                                  .toDateString()
                                  .split(" ")
                                  .slice(1)
                                  .join(" ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="h-full w-[85%] m-[0_auto] mt-[2.5rem]">
            <p className="font-bold text-lg">All blog posts</p>
            <div className=" w-full mt-[2.5rem] grid grid-cols-3 gap-8">
              {paginatedPosts?.length ? (
                paginatedPosts?.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))
              ) : (
                <h3>No blogs found!</h3>
              )}
            </div>
            <Pagination
              items={sortedPosts?.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Home
