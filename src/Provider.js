"use client"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
      <ToastContainer />
    </SessionProvider>
  )
}
