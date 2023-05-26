"use client"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const router = useRouter()
  const [form, setForm] = useState(initialState)

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
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      if (res?.error == null) {
        router.push("/")
      } else {
        toast.error("Error occurred while logging in!")
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="mt-[5rem] h-[calc(100vh - 60px)] w-full">
      <div className="w-[85%] m-[0_auto] flex flex-col items-center">
        <h2 className="text-[32px] text-[#222] tracking-[1px]">Login</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-[2rem] w-[25%] p-[1.5rem] border-[1px] border-solid border-[#666] rounded-[8px] flex flex-col justify-center items-center gap-[2rem]"
        >
          <input
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={form.email}
            name="email"
            className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
          />
          <input
            type="password"
            placeholder="********"
            onChange={handleChange}
            value={form.password}
            name="password"
            className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
          />
          <button className="outline-0 p-[0.5rem_1rem] border-[1px] border-solid border-transparent text[17px] font-bold bg-[#efefef] text-[#22ab22] transition-[150ms] tracking-[0.5px] hover:border-[#22ab22] hover:bg-[#22ab22] hover:text-[#efefef] ">
            Login
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
