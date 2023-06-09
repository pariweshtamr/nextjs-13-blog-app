"use client" // to use onClick methods on server components like next/image we need to have 'use client' above everything else on the page
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { signIn, signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import logo from "/public/logo.png"

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleDropDown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleShowDropdown = () => setShowDropdown((prev) => true)

  const handleHideDropdown = () => setShowDropdown((prev) => false)

  return (
    <div
      className={
        pathname !== "/"
          ? "z-[999] h-[100px] w-[100%] flex justify-center items-center top-0 left-0"
          : `bg-[#FCF6ED] bg-[url('https://www.transparenttextures.com/patterns/xv.png')] z-[999] h-[100px] w-[100%] flex justify-center items-center top-0 left-0`
      }
    >
      <div className="w-[85%] m-[0 auto] flex justify-between items-center relative">
        <h2 className="text-4xl text-[#d14201]">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              width={130}
              height={500}
              className="sm:w-[100px]"
            />
          </Link>
        </h2>
        <ul className="flex items-center gap-[1.25rem]">
          {session?.user ? (
            <div>
              {session?.user?.profileImg !== "" ? (
                <Image
                  onClick={handleDropDown}
                  src={session?.user?.profileImg}
                  alt="profile-img"
                  width={45}
                  height={45}
                  className="object-cover rounded-[50%] cursor-pointer"
                />
              ) : (
                <p
                  onClick={handleShowDropdown}
                  className="cursor-pointer font-bold capitalize"
                >
                  {session?.user?.username}
                </p>
              )}

              {showDropdown && (
                <div className="absolute w-[12%] bg-[#efefef] p-[1rem] flex flex-col justify-center items-center gap-[1rem] top-[5rem] right-[-3.5rem] rounded-[8px] sm:right-0 sm:top-[4.3rem] xl:w-max xl:right-[-2.4rem]">
                  <div className="w-[20px] h-[20px] bg-[#efefef] absolute top-[-3px] rotate-45 sm:right-3"></div>
                  <AiOutlineClose
                    className="absolute top-[0.3rem] right-[0.3rem] cursor-pointer hover:bg-black hover:text-white hover:rounded-[50%] sm:text-xs"
                    onClick={handleHideDropdown}
                  />

                  <Link
                    onClick={handleHideDropdown}
                    href={`/${session?.user?.username}`}
                    className="text-[#444] text-[18px] font-[300] mt-[1rem] hover:text-[#d14201] sm:text-sm"
                  >
                    Profile
                  </Link>

                  <Link
                    onClick={handleHideDropdown}
                    href="/create-post"
                    className="text-[#444] text-[18px] font-[300] hover:text-[#d14201] sm:text-sm"
                  >
                    Create post
                  </Link>

                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      handleHideDropdown()
                    }}
                    className="p-[0.4rem_1rem] w-full border-none text-white rounded-[6px] font-bold text-[17px] bg-[#d14201] sm:text-sm sm:p-[.2rem_.8rem]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={signIn}
                className="border-none outline-none p-[.5rem_1.25rem] text-[17px] bg-[#d14201] text-white rounded-[6px] sm:p-[.3rem_1rem]"
              >
                Login
              </button>
              <Link href="/register">Register</Link>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
export default Navbar
