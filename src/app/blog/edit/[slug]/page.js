"use client"
import {
  editBlogAction,
  getSingleBlogAction,
} from "@/app/redux/blog/blogAction"
import axios from "axios"
import DOMPurify from "dompurify"
import JoditEditor from "jodit-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { BsFillPlusCircleFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"

const EditBlog = (obj) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("Nature")
  const [img, setImg] = useState("")
  const [photo, setPhoto] = useState("")
  const editor = useRef(null)
  const { data: session, status } = useSession()
  const { selectedBlog } = useSelector((state) => state.blog)
  const router = useRouter()

  const config = {
    readonly: false,
    placeholder: "Start typing...",
  }

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

    if (!title || !category) {
      return toast.error("All fields are required!")
    }

    try {
      let imageUrl = null
      if (photo) {
        imageUrl = await uploadImage()
      }
      const dirtyHtml = editor?.current?.value
      const cleanContent = DOMPurify.sanitize(dirtyHtml)

      dispatch(
        editBlogAction({
          slug: obj.params.slug,
          token: session?.user?.accessToken,
          title,
          cleanContent,
          category,
          imageUrl: photo ? imageUrl : img,
        })
      )

      router.push(`/blog/${selectedBlog?.slug}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    !selectedBlog && dispatch(getSingleBlogAction(obj.params.slug))

    if (selectedBlog) {
      setTitle(selectedBlog.title)
      setCategory(selectedBlog.category)
      setImg(selectedBlog.imageUrl)
      setContent(selectedBlog.content)
    }
  }, [dispatch, obj.params.slug, selectedBlog])

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
      <div className="w-[70%] m-[0_auto] flex flex-col items-center">
        <h2 className="text-[32px] text-[#222] tracking-[1px]">Edit Post</h2>
        <div>
          {photo ? (
            <div className="w-full m-[0_auto]">
              <Image
                src={URL.createObjectURL(photo)}
                alt="post-img"
                width={500}
                height={500}
                className="w-full h-full m-[0_auto] mt-[2rem]"
              />
            </div>
          ) : img ? (
            <div className="w-full m-[0_auto]">
              <Image
                src={img}
                alt="post-img"
                width={2100}
                height={2100}
                className="w-full h-full m-[0_auto] mt-[2rem]"
              />
            </div>
          ) : (
            ""
          )}
        </div>

        <form className="mt-[2rem] w-full" onSubmit={handleSubmit}>
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
              value={title}
              required
              className="flex-1 text-[24px] border-b border-b-solid border-b-[#666] bg-transparent outline-none placeholder:tracking-[2px]"
            />

            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
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
          <JoditEditor ref={editor} value={content} config={config} required />
        </form>
      </div>
    </div>
  )
}
export default EditBlog
