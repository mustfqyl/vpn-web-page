import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { pasarguardService } from '@/lib/pasarguard'
import { z } from 'zod'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = registerSchema.parse(body)

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        // Create user in database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        // Provision VPN account in PasarGuard Panel
        let pasarguardId: string | null = null
        let pasarguardSubUrl: string | null = null

        try {
            const pgUser = await pasarguardService.createUser(email, {
                expireDays: 7,  // 7-day trial
                group: 'trial'
            })
            pasarguardId = pgUser.username
            pasarguardSubUrl = pgUser.subscription_url

            // Update user with PasarGuard info
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    pasarguardId,
                    pasarguardSubUrl,
                }
            })

            // Create initial subscription record
            const expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + 7)

            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    planName: 'trial',
                    expiresAt,
                    active: true,
                }
            })
        } catch (pgError) {
            console.error('Failed to create PasarGuard user during registration:', pgError)
            // Don't fail the registration — user can still use the web portal
            // PasarGuard account will be provisioned on first payment/activation
        }

        // Create a token for the new user
        const token = generateToken({ userId: user.id, email: user.email, role: user.role })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({
            user: {
                ...userWithoutPassword,
                pasarguardId,
                pasarguardSubUrl,
            },
            token
        }, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
}
