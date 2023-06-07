"use client"
import Loader from "@/components/loader/Loader"
import { createPost } from "@/lib/axiosHelper"
import axios from "axios"
import DOMPurify from "dompurify"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import { BsFillPlusCircleFill } from "react-icons/bs"
import { toast } from "react-toastify"

const Jodit = dynamic(() => import("../../components/jodit/Jodit"), {
  ssr: false,
})

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Nature")
  const [photo, setPhoto] = useState("")
  const editor = useRef(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const cloudName = "ddbttkmhz"
  const uploadPreset = "next_blog"

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
    }),
    []
  )

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
    const dirtyHtml = editor?.current?.value
    const cleanContent = DOMPurify.sanitize(dirtyHtml)

    let imageUrl
    if (!imageUrl) {
      imageUrl = await uploadImage()
    }

    if (title.trim() === "") {
      return toast.warning("Title is required!")
    }
    if (!category) {
      return toast.warning("Please select a category for the post!")
    }

    try {
      const { status, message, blog } = await createPost({
        title,
        imageUrl,
        category,
        cleanContent,
        authorId: session?.user?._id,
        token: session.user.accessToken,
      })

      if (status !== "success") {
        return toast[status](message)
      }

      toast[status](message) && router.push(`/blog/${blog?.slug}`)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (status === "loading") {
    return <Loader />
  } else if (status === "unauthenticated") {
    router.push("/")
  }

  return (
    <div className="mt-[3rem] h-[calc(100ch - 60px)] w-full">
      <div className="w-[85%] m-[0_auto] flex flex-col items-center">
        <h2 className="text-[32px] text-[#222] tracking-[1px] font-bold underline">
          Create Post
        </h2>
        <div>
          {photo ? (
            <Image
              src={URL.createObjectURL(photo)}
              alt="post-img"
              width={2100}
              height={2100}
              className="w-1/2 h-1/2 m-[0_auto] mt-[2rem] md:w-full"
            />
          ) : (
            ""
          )}
        </div>

        <form className="mt-[2rem] w-[100%]" onSubmit={handleSubmit}>
          <div className="flex items-center py-2 pb-[3rem] gap-5 sm:flex-col">
            <div className="flex items-center gap-4 w-full">
              <label htmlFor="image">
                <BsFillPlusCircleFill className="text-[2rem] sm:text-[1.2rem] md:text-[1.5rem] text-[#666] cursor-pointer" />
              </label>
              <input
                type="file"
                id="image"
                style={{ display: "none" }}
                onChange={(e) => setPhoto(e.target.files[0])}
                required
              />
              <input
                type="text"
                placeholder="Title..."
                onChange={(e) => setTitle(e.target.value)}
                required
                className="flex-1 text-[24px] border-b border-b-solid border-b-[#666] bg-transparent outline-none placeholder:tracking-[2px] md:text-lg"
              />
            </div>

            <select
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={0}
              required
              className="p-[.7rem_1rem] outline-none cursor-pointer appearance-none border border-solid border-[#666] resize-none rounded-[6px] md:p-[.4rem_.8rem]"
            >
              <option value={0} disabled>
                -- Select a category --
              </option>
              <option value="Nature">Nature</option>
              <option value="Mountain">Mountain</option>
              <option value="God">God</option>
              <option value="Ocean">Ocean</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Life">Life</option>
              <option value="Forest">Forest</option>
            </select>

            <button
              type="submit"
              className="mt-[2.5rem outline-none border border-solid border-transparent p-[.7rem_1rem] rounded-[6px] bg-[#efefef] text-[#d14201] cursor-pointer transition-[150ms] hover:bg-[#d14201] hover:border-[#d14201] hover:text-[#efefef] md:p-[.4rem_.8rem]"
            >
              Publish
            </button>
          </div>
          <Jodit editor={editor} config={config} required />
        </form>
      </div>
    </div>
  )
}
export default CreateBlog
