import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing current or new password' }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 })
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

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        // Update user
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        })

        return NextResponse.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        console.error("Password update error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
