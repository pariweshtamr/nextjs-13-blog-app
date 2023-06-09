"use client"
import Spinner from "@/components/spinner/Spinner"
import { registerUser } from "@/lib/axiosHelper"
import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import { AiOutlineFileImage } from "react-icons/ai"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { toast } from "react-toastify"

const initialState = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
}
const Register = () => {
  const [form, setForm] = useState(initialState)
  const [meter, setMeter] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [photo, setPhoto] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const cloudName = "ddbttkmhz"
  const uploadPreset = "next_blog"

  const atLeastOneUpperCase = /[A-Z]/g // capital letters from A - Z
  const atLeastOneLowerCase = /[a-z]/g // capital letters from a - z
  const atleastOneNumeric = /[0-9]/g // numbers from 0 - 9
  const atLeastOneSpecialChar = /[!@#$%^&*()_+?./-]/g // any of the special characters with the square brackets
  const sevenCharsOrMore = /.{7,}/g // seven or more characters

  const passwordTracker = {
    uppercase: form.password.match(atLeastOneUpperCase),
    lowercase: form.password.match(atLeastOneLowerCase),
    numeric: form.password.match(atleastOneNumeric),
    specialChar: form.password.match(atLeastOneSpecialChar),
    sevenOrMoreChars: form.password.match(sevenCharsOrMore),
  }

  const passwordStrength = Object.values(passwordTracker).filter(
    (value) => value
  ).length

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
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

    let profileImg

    if (photo) {
      profileImg = await uploadImage()
    }

    const { confirmPassword, ...rest } = form

    if (rest.password !== confirmPassword) {
      return toast.error("Password do not match!")
    }

    if (passwordStrength !== 5) return

    try {
      setIsLoading(true)
      const { status, message } = await registerUser({ ...rest, profileImg })
      setIsLoading(false)
      status && toast[status](message)
      setForm(initialState)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  return (
    <div className="mt-[2rem] h-[calc(100vh - 60px)] w-full">
      <div className="w-[85%] m-[0_auto] flex flex-col items-center">
        <h2 className="text-[32px] text-[#222] tracking-[1px]">Register</h2>
        <p className="text-[12px] text-[#555]">
          Register now and start writing blogs!
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-[2rem] w-[30%] p-[1.5rem] border-[1px] border-solid border-[#666] rounded-[8px] flex flex-col justify-center items-center gap-[2rem] sm:w-[100%] lg:w-[60%]"
        >
          <input
            type="text"
            placeholder="Enter a username"
            onChange={handleChange}
            value={form.username}
            required
            name="username"
            className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
          />
          <input
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={form.email}
            required
            name="email"
            className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
          />
          <div className="w-full relative">
            <input
              onKeyDown={() => setMeter(true)}
              type={reveal ? "text" : "password"}
              placeholder="********"
              onChange={handleChange}
              value={form.password}
              minLength={7}
              required
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
          {meter && (
            <>
              <div className="text-[.8rem] text-[#333]">
                Password Strength:{" "}
                {passwordStrength === 1
                  ? "Poor"
                  : passwordStrength === 2
                  ? "Fair"
                  : passwordStrength === 3
                  ? "Good"
                  : passwordStrength === 4
                  ? "Good"
                  : passwordStrength === 5
                  ? "Excellent"
                  : ""}
              </div>
              <div
                className={`h-[.3rem] w-full bg-[lightgray] rounded-[3px] before:h-full before:rounded-[3px] before:block ${
                  passwordStrength === 1
                    ? "before:w-[20%]"
                    : passwordStrength === 2
                    ? "before:w-[40%]"
                    : passwordStrength === 3
                    ? "before:w-[60%]"
                    : passwordStrength === 4
                    ? "before:w-[80%]"
                    : passwordStrength === 5
                    ? "before:w-[100%]"
                    : "before:w-[0%]"
                } ${
                  passwordStrength === 1
                    ? "before:bg-[red]"
                    : passwordStrength === 2
                    ? "before:bg-[yellow]"
                    : passwordStrength === 3
                    ? "before:bg-[#03a2cc]"
                    : passwordStrength === 4
                    ? "before:bg-[#03a2cc]"
                    : passwordStrength === 5
                    ? "before:bg-[#0ce052]"
                    : "before:bg-[lightgray]"
                }`}
              ></div>

              <div className="text-[0.7rem]">
                {passwordStrength < 5 && "Must contain "}
                {!passwordTracker.uppercase && "uppercase, "}
                {!passwordTracker.lowercase && "lowercase, "}
                {!passwordTracker.specialChar && "special character, "}
                {!passwordTracker.numeric && "number, "}
                {!passwordTracker.sevenOrMoreChars && "seven character or more"}
              </div>
            </>
          )}
          <input
            type="password"
            placeholder="********"
            onChange={handleChange}
            value={form.confirmPassword}
            required
            name="confirmPassword"
            className="outline-none border-b border-b-[#666] p-[0.5rem] w-full"
          />

          <label
            htmlFor="image"
            className="w-full flex items-center gap-[1.25rem] cursor-pointer"
          >
            Upload Image <AiOutlineFileImage />
          </label>
          <input
            type="file"
            id="image"
            style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <button className="outline-0 p-[0.5rem_1rem] rounded-[6px] border-[1px] border-solid border-transparent text[16px] font-bold bg-[#efefef] text-[#d14201] transition-[150ms] tracking-[0.5px] hover:border-[#d14201] hover:bg-[#d14201] hover:text-[#efefef] ">
            {isLoading ? <Spinner /> : "Register"}
          </button>
          <div className="text-sm text-center">
            Already have an account? <br />
            <Link
              href="/login"
              className="cursor-pointer text-underline hover:text-[#555] underline"
            >
              Login Now!
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Register
