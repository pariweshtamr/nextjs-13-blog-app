import jwt from "jsonwebtoken"
export const signJwtToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET
  const token = jwt.sign(payload, secret, options)
  return token
}

export const verifyJwtToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET
    const payload = jwt.verify(token, secret)
    return payload
  } catch (error) {
    console.log(error)
    return null
  }
}
