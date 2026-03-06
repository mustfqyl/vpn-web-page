import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { pasarguardService } from '@/lib/pasarguard'

export const dynamic = 'force-dynamic'

export async function POST() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.decode(token) as { userId: string } | null

        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { userId } = decoded

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscriptions: true }
        })

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30) // Add 30 days

        // Create PasarGuard user if not exists
        if (!user.pasarguardId) {
            try {
                const pgUser = await pasarguardService.createUser(user.email, {
                    expireDays: 30, // Paid creation gets 30 days
                    group: 'user' // Paid group
                })
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        pasarguardId: pgUser.username,
                        pasarguardSubUrl: pgUser.subscription_url
                    }
                })
            } catch (e) {
                console.error("Failed to create PasarGuard user", e)
                return NextResponse.json({ error: 'Failed to provision VPN account' }, { status: 500 })
            }
        } else {
            // Update existing PasarGuard user's expiry AND group
            try {
                const newExpire = Math.floor(expiresAt.getTime() / 1000)
                // Fetch group ID for 'user' group from PasarGuard
                const groupsRes = await fetch(
                    `${process.env.PASARGUARD_API_URL?.replace(/\/$/, '')}/api/groups`,
                    { headers: { 'Content-Type': 'application/json' } }
                )
                let groupIds: number[] | undefined
                if (groupsRes.ok) {
                    const gData = await groupsRes.json()
                    const match = (gData.groups || []).find((g: any) => g.name.toLowerCase() === 'user')
                    if (match) groupIds = [match.id]
                }
                await pasarguardService.updateUser(user.pasarguardId, {
                    expire: newExpire,
                    status: 'active',
                    ...(groupIds ? { group_ids: groupIds } : {})
                })
            } catch (e) {
                console.error("Failed to update PasarGuard user expiry", e)
            }
        }

        const existingSub = user.subscriptions.find(s => s.active)

        if (existingSub) {
            const updatedSub = await prisma.subscription.update({
                where: { id: existingSub.id },
                data: {
                    active: true,
                    expiresAt,
                    planName: 'premium'
                }
            })
            return NextResponse.json({ success: true, subscription: updatedSub })
        } else {
            const newSub = await prisma.subscription.create({
                data: {
                    userId,
                    planName: 'premium',
                    expiresAt,
                    active: true
                }
            })
            return NextResponse.json({ success: true, subscription: newSub })
        }

    } catch (error) {
        console.error("Payment error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
