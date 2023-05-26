import bcrypt from "bcrypt"

const saltrounds = 10

export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, saltrounds)
}

export const comparePassword = (plainPassword, hashPasswordFromDb) => {
  return bcrypt.compareSync(plainPassword, hashPasswordFromDb)
}
