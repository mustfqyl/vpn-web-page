import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'
import { pasarguardService } from '@/lib/pasarguard'
import { z } from 'zod'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = loginSchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Sync check: If user was deleted from PasarGuard, delete locally
        if (user.pasarguardId) {
            try {
                const pgUser = await pasarguardService.getUser(user.pasarguardId)
                if (!pgUser) {
                    // User was explicitly not found (404), sync deletion
                    await prisma.user.delete({ where: { id: user.id } })
                    return NextResponse.json({ error: 'Your account was removed from the system' }, { status: 401 })
                }
            } catch (pgError) {
                // Connection or 500 error from PasarGuard. Do not delete the user.
                console.error("PasarGuard connection error during login:", pgError)
                // We still let them login to the web dashboard
            }
        }

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })

        // Remove sensitive data
        delete (user as { password?: string }).password;

        return NextResponse.json({ user, token }, { status: 200 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
