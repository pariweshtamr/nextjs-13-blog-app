import NextAuth from "next-auth/next"
import User from "@/models/User"
import CredentialsProvider from "next-auth/providers/credentials"
import { signJwtToken } from "@/lib/jwt"
import { comparePassword } from "@/lib/bcrypt"
import dbConnect from "@/lib/db"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "John Doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials
        await dbConnect()

        const user = await User.findOne({ email })
        if (!user) {
          throw new Error("User not found!")
        }

        const isPassMatch = comparePassword(password, user.password)

        if (!isPassMatch) {
          throw new Error("Invalid username or password!")
        } else {
          const { password, __v, ...currentUser } = user._doc

          const accessToken = signJwtToken(currentUser, { expiresIn: "1d" })

          return {
            ...currentUser,
            accessToken,
          }
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token._id = user._id
        token.username = user.username
        token.profileImg = user.profileImg
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.accessToken = token.accessToken
        session.user.username = token.username
        session.user.profileImg = token.profileImg
      }

      return session
    },
  },
})

export { handler as GET, handler as POST }
