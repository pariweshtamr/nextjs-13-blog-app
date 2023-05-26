"use client"
import { createPost } from "@/lib/axiosHelper"
import axios from "axios"
import DOMPurify from "dompurify"
import JoditEditor from "jodit-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { BsFillPlusCircleFill } from "react-icons/bs"
import { toast } from "react-toastify"

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [category, setCategory] = useState("Nature")
  const [photo, setPhoto] = useState("")
  const editor = useRef(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const cloudName = "ddbttkmhz"
  const uploadPreset = "next_blog"

  const config = {
    readonly: false,
    placeholder: "Start typing...",
  }

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
        desc,
        imageUrl,
        category,
        cleanContent,
        authorId: session?.user?._id,
        token: session.user.accessToken,
      })

      if (status !== "success") {
        return toast[status](message)
      }

      toast[status](message) && router.push(`/blog/${blog?._id}`)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

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
        <h2 className="text-[32px] text-[#222] tracking-[1px]">Create Post</h2>
        <div>
          {photo && (
            <Image
              src={URL.createObjectURL(photo)}
              alt="post-img"
              width={100}
              height={100}
              className="w-1/2 h-1/2 m-[0_auto] mt-[2rem]"
            />
          )}
        </div>
        {/* <form
          onSubmit={handleSubmit}
          className="mt-[2rem] w-[30%] p-[1.5rem] border border-solid border-[#666] flex flex-col justify-start items-center gap-[2rem]"
        >
          <input
            type="text"
            placeholder="Title..."
            onChange={(e) => setTitle(e.target.value)}
            className="outline-[none] border-b border-b-solid border-b-[#666]"
          />
          <textarea
            name=""
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
            Create
          </button>
        </form> */}

        <form className="mt-[2rem] w-[100%]" onSubmit={handleSubmit}>
          <div className="flex items-center py-2 pb-[3rem] gap-5">
            <label htmlFor="image">
              <BsFillPlusCircleFill className="text-[2rem] text-[#666] cursor-pointer" />
            </label>
            <input
              type="file"
              id="image"
              style={{ display: "none" }}
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <input
              type="text"
              placeholder="Title..."
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 text-[24px] border-b border-b-solid border-b-[#666] bg-transparent outline-none placeholder:tracking-[2px]"
            />

            <select
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={0}
              className="p-[.7rem_1rem] outline-none cursor-pointer appearance-none border border-solid border-[#666] resize-none rounded-[6px]"
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
              className="mt-[2.5rem outline-none border border-solid border-transparent p-[.7rem_1rem] rounded-[6px] bg-[#efefef] text-[#d14201] cursor-pointer transition-[150ms] hover:bg-[#d14201] hover:border-[#d14201] hover:text-[#efefef]"
            >
              Publish
            </button>
          </div>
          <JoditEditor ref={editor} config={config} required />
        </form>
      </div>
    </div>
  )
}
export default CreateBlog
