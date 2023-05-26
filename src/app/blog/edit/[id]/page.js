"use client"
import { editBlog, getBlog } from "@/lib/axiosHelper"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AiOutlineFileImage } from "react-icons/ai"
import { toast } from "react-toastify"

const EditBlog = (obj) => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [category, setCategory] = useState("Nature")
  const [photo, setPhoto] = useState("")
  const { data: session, status } = useSession()
  const router = useRouter()

  const cloudName = "ddbttkmhz"
  const uploadPreset = "next_blog"

  const uploadImage = async () => {
    if (!photo) return

    const formData = new FormData()
    formData.append("file", photo)
    formData.append("upload_preset", uploadPreset)

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      )

      const { url } = data

      return url
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !desc || !category) {
      return toast.error("All fields are required!")
    }

    try {
      let imageUrl = null
      if (photo) {
        imageUrl = await uploadImage()
      }

      const { status, message, blog } = await editBlog({
        id: obj.params.id,
        token: session?.user?.accessToken,
        title,
        desc,
        category,
        imageUrl,
      })

      if (status !== "success") {
        return toast.error(message)
      }
      router.push(`/blog/${blog?._id}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const { blog } = await getBlog(obj.params.id)

      if (blog) {
        setTitle(blog.title)
        setDesc(blog.desc)
        setCategory(blog.category)
      }
    }
    fetchBlogs()
  }, [])

  if (status === "loading") {
    return <p>Loading...</p>
  } else if (status === "unauthenticated") {
    return (
      <p className="w-full text-center mt-[5rem] text-[32px] font-bold">
        Access Denied
      </p>
    )
  }

  return (
    <div className="mt-[5rem] h-[calc(100ch - 60px)] w-full">
      <div className="w-[85%] m-[0_auto] flex flex-col items-center">
        <h2 className="text-[32px] text-[#222] tracking-[1px]">Edit Post</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-[2rem] w-[30%] p-[1.5rem] border border-solid border-[#666] flex flex-col justify-start items-center gap-[2rem]"
        >
          <input
            type="text"
            value={title}
            placeholder="Title..."
            onChange={(e) => setTitle(e.target.value)}
            className="outline-[none] border-b border-b-solid border-b-[#666]"
          />
          <textarea
            value={desc}
            placeholder="Description..."
            onChange={(e) => setDesc(e.target.value)}
            className="outline-[none] border-b border-b-solid border-b-[#666]"
          />
          <select
            name=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none border-b border-b-solid border-b-[#666] p-[.4rem] resize-none text-[18px] w-[180px] bg-[#efefef] rounded-[8px]"
          >
            <option value="Nature">Nature</option>
            <option value="Mountain">Mountain</option>
            <option value="God">God</option>
            <option value="Ocean">Ocean</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Life">Life</option>
            <option value="Forest">Forest</option>
          </select>
          <label
            htmlFor="image"
            className="w-[175px] flex items-center gap-[1.25rem] text-[18px] font-bold cursor-pointer"
          >
            Upload Image <AiOutlineFileImage />
          </label>
          <input
            type="file"
            id="image"
            style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button
            type="submit"
            className="mt-[2.5rem outline-none border border-solid border-transparent p-[.5rem_1.25rem] text-[18px] rounded-[12px] bg-[#22ab22] text-[#efefef] cursor-pointer transition-[150ms] hover:bg-[#efefef] hover:border-[#22ab22] hover:text-[#22ab22]"
          >
            Edit
          </button>
        </form>
      </div>
    </div>
  )
}
export default EditBlog
