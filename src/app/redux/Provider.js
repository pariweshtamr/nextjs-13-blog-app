"use client"
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import store from "./store"

export const Providers = ({ children, session }) => {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        {children}
        <ToastContainer />
      </SessionProvider>
    </Provider>
  )
}
