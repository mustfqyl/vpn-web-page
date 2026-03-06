import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash)
}

export const generateToken = (payload: object, expiresIn: string | number = '1d') => {
    const options: jwt.SignOptions = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}
