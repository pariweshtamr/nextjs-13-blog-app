"use client" // to use onClick methods on server components like next/image we need to have 'use client' above everything else on the page
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import person from "../../../public/devbw.png"
import { AiOutlineClose } from "react-icons/ai"
import { signIn, signOut, useSession } from "next-auth/react"

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const { data: session } = useSession()

  const handleShowDropdown = () => setShowDropdown((prev) => true)

  const handleHideDropdown = () => setShowDropdown((prev) => false)

  return (
    <div className="sticky z-[999] h-[80px] w-[100%] bg-white shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.1)] flex justify-center items-center top-0 left-0">
      <div className="w-[85%] m-[0 auto] flex justify-between items-center relative">
        <h2 className="text-4xl text-[rgb(26,180,26)]">
          <Link href="/">Blog App</Link>
        </h2>
        <ul className="flex items-center gap-[1.25rem]">
          {session?.user ? (
            <div>
              <Image
                onClick={handleShowDropdown}
                src={person}
                alt="profile-img"
                width={45}
                height={45}
                className="object-cover rounded-[50%] cursor-pointer"
              />

              {showDropdown && (
                <div className="absolute bg-[#efefef] p-[1rem] flex flex-col items-center gap-[1.25rem] top-[2.5rem] right-[-3rem] rounded-[8px]">
                  <AiOutlineClose
                    className="absolute top-[0.3rem] right-[0.3rem] cursor-pointer hover:bg-black hover:text-white hover:rounded-[50%]"
                    onClick={handleHideDropdown}
                  />
                  <button
                    onClick={() => {
                      signOut()
                      handleHideDropdown()
                    }}
                    className="ml-[1rem] mt-[1rem] p-[0.4rem_1rem] border-none text-white rounded-[8px] font-bold text-[17px] bg-[#10c142]"
                  >
                    Logout
                  </button>
                  <Link
                    onClick={handleHideDropdown}
                    href="/create-post"
                    className="text-[#444] text-[18px] font-[300]"
                  >
                    Create
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={signIn}
                className="border-none outline-none p-[.5rem_1.25rem] text-[17px] bg-[#10c142] text-white rounded-[12px]"
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
