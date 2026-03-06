import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { currentPassword } = body

        if (!currentPassword) {
            return NextResponse.json({ error: 'Missing current password' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = verifyToken(token) as { userId: string } | null

        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { userId } = decoded

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password)

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid current password' }, { status: 401 })
        }

        return NextResponse.json({ success: true, message: 'Password verified' })
    } catch (error) {
        console.error("Password verification error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
