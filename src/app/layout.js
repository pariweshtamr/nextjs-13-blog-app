"use client"
import Navbar from "@/components/navbar/Navbar"
import "./globals.css"
import Footer from "@/components/footer/Footer"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// export const metadata = {
//   title: "Next Blog App",
//   description: "Blog Application",
// }

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className="min-h-[100vh] flex flex-col">
        <SessionProvider session={session}>
          <Navbar />
          <main className="grow shrink basis-auto">{children}</main>
          <Footer />
        </SessionProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
