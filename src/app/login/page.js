"use client"
import Spinner from "@/components/spinner/Spinner"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { toast } from "react-toastify"

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const router = useRouter()
  const [form, setForm] = useState(initialState)
  const [reveal, setReveal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, password } = form

    if (!password || !email) {
      return toast.error("Fill all fields!")
    }

    try {
      setIsLoading(true)
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: `${window.location.origin}`,
      })

      if (res?.error === null) {
        setIsLoading(false)
        router.push("/")
      } else {
        setIsLoading(false)
        toast.error(res.error)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error.message)
    }
  }
  return (
    <div className="mt-[1rem] h-[calc(100vh - 60px)] w-full">
      <div className="w-[85%] m-[0_auto] flex flex-col items-center">
        <h2 className="text-[32px] text-[#222] tracking-[1px]">Login</h2>
        <p className="text-[12px] text-[#555]">
          Login to access and manage your blog posts
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-[2rem] w-[25%] p-[1.5rem] border-[1px] border-solid border-[#666] rounded-[8px] flex flex-col justify-center items-center gap-[2rem] sm:w-[100%] lg:w-[60%]"
        >
          <input
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={form.email}
            name="email"
            required
            className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
          />

          <div className="w-full relative">
            <input
              type={reveal ? "text" : "password"}
              placeholder="********"
              required
              onChange={handleChange}
              value={form.password}
              name="password"
              className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
            />
            {!reveal ? (
              <MdVisibilityOff
                onClick={() => setReveal(true)}
                className="absolute top-1/2 right-[0.8rem] translate-y-[-50%] cursor-pointer text-[1.1rem]"
              />
            ) : (
              <MdVisibility
                onClick={() => setReveal(false)}
                className="absolute top-1/2 right-[0.8rem] translate-y-[-50%] cursor-pointer text-[1.1rem]"
              />
            )}
          </div>
          <button className="outline-0 p-[0.5rem_1.5rem] rounded-[6px] border-[1px] border-solid border-transparent text[17px] font-bold bg-[#efefef] text-[#d14201] transition-[150ms] tracking-[0.5px] hover:border-[#d14201] hover:bg-[#d14201] hover:text-[#efefef] ">
            {isLoading ? <Spinner /> : "Login"}
          </button>
          <div className="text-[16px] mt-[1.75rem] text-center">
            Don&apos;t have an account? <br />
            <Link
              href="/register"
              className="cursor-pointer text-underline hover:text-[#555] underline"
            >
              Register Now!
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login
