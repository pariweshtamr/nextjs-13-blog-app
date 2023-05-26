import Navbar from "@/components/navbar/Navbar"
import "./globals.css"
import Footer from "@/components/footer/Footer"
import { Provider } from "@/Provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Next Blog App",
  description: "Blog Application",
}

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-[100vh] flex flex-col`}>
        <Provider>
          <Navbar />
          <main className="grow shrink basis-auto">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}
