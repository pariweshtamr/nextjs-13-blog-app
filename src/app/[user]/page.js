"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserBlogsAction } from "../redux/blog/blogAction"
import Loader from "@/components/loader/Loader"
import { useRouter } from "next/navigation"
import { paginate } from "@/lib/paginate"
import BlogCard from "@/components/blogCard/BlogCard"
import Pagination from "@/components/pagination/Pagination"
import Image from "next/image"
import { getUserAction } from "../redux/user/userAction"
import avatar from "../../../public/avatar.jpg"

const Profile = (obj) => {
  const dispatch = useDispatch()
  const { blogs, isLoading } = useSelector((state) => state.blog)
  const { user } = useSelector((state) => state.user)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 6

  const onPageChange = (page) => {
    setCurrentPage((prev) => page)
  }

  useEffect(() => {
    dispatch(getUserAction(session?.user?._id))
    dispatch(getUserBlogsAction(session?.user?._id))
  }, [dispatch, session?.user?._id])

  const sortedPosts = [...blogs]?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const paginatedPosts = paginate(sortedPosts, currentPage, pageSize)

  if (status === "loading") {
    return <Loader />
  } else if (status === "unauthenticated") {
    router.push("/")
  }

  return (
    <>
      <div className="h-full w-[85%] m-[0_auto] mt-[2.5rem]">
        <div className="w-[50%] m-[0_auto]">
          <div className="w-full pb-8">
            {user?.profileImg ? (
              <Image
                src={user?.profileImg}
                alt="profile-img"
                width={500}
                height={500}
                className="w-[12rem] h-[12rem] border-2 border-solid border-[#d14201] rounded-full m-[0_auto]"
              />
            ) : (
              <Image
                src={
                  session?.user?.profileImg ? session?.user?.profileImg : avatar
                }
                alt="profile-img"
                width={500}
                height={500}
                className="w-[12rem] h-[12rem] border-2 border-solid border-[#d14201] rounded-full m-[0_auto]"
              />
            )}
          </div>
          <div className="w-full">
            <h6 className="uppercase font-bold text-[#d14201]">
              Personal Information
            </h6>
            <hr />
            <div className="flex justify-between mt-2 mb-5">
              <div className="font-bold">
                Username{" "}
                <p className="font-normal text-[gray]">{user?.username}</p>
              </div>
              <div className="font-bold">
                Email Address{" "}
                <p className="font-normal text-[gray]">{user?.email}</p>
              </div>
            </div>

            <h6 className="uppercase font-bold text-[#d14201]">
              Account Information
            </h6>
            <hr />
            <div className="font-bold mt-2">
              Joined{" "}
              <p className="font-normal text-[gray]">
                {new Date(user?.createdAt).toDateString()}
              </p>
            </div>
          </div>

          <div className="mt-5 w-full flex justify-center">
            <button className="p-[.5rem_1rem] rounded-[5px] bg-[#d14201] text-white hover:shadow-[0_5px_20px_0_rgba(0,0,0,0.2),0_13px_24px_-11px_rgba(156,39,176,0.6)]">
              Update Password
            </button>
          </div>
        </div>
      </div>

      <div className="h-full w-[85%] m-[0_auto] mt-[2.5rem]">
        <p className="font-bold text-lg">My blog posts</p>

        <div className=" w-full mt-[2.5rem] grid grid-cols-3 gap-8 sm:grid-cols-1 lg:grid-cols-2">
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
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  )
}

export default Profile
