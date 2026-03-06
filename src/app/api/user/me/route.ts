import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { pasarguardService } from '@/lib/pasarguard'

export const dynamic = 'force-dynamic'

export async function GET() {
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
            include: { subscriptions: true, devices: true }
        })

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const activeSub = user.subscriptions.find((sub: { active: boolean; expiresAt: Date }) => sub.active && sub.expiresAt > new Date())

        // Fetch live data from PasarGuard
        let usedTrafficGB = 0
        let dataLimitGB: number | null = null
        let onlineCount = 0
        let vpnStatus: 'active' | 'disabled' | 'expired' | 'limited' = 'active'
        let subscriptionUrl = user.pasarguardSubUrl || null
        let liveExpireAt: Date | null = activeSub ? activeSub.expiresAt : null

        if (user.pasarguardId) {
            try {
                // Use email-based username (same logic as createUser)
                const pgUsername = user.pasarguardId
                const pgUser = await pasarguardService.getUser(pgUsername)

                if (pgUser) {
                    // Convert bytes to GB
                    usedTrafficGB = pgUser.used_traffic / (1024 * 1024 * 1024)
                    dataLimitGB = pgUser.data_limit
                        ? pgUser.data_limit / (1024 * 1024 * 1024)
                        : null

                    // Determine online connections
                    // In Marzban, links contains subscription links, NOT active IP connections. 
                    // Active IPs are separate. We simply check if online_at is very recent.
                    if (pgUser.online_at) {
                        // PasarGuard/Marzban stores UTC timestamp in ISO string
                        const lastSeen = new Date(pgUser.online_at).getTime()
                        const now = Date.now()
                        // If seen within the last 5 minutes, consider as 1 active connection
                        if (now - lastSeen < 5 * 60 * 1000) {
                            onlineCount = 1
                        }
                    }

                    if (pgUser.expire !== null && pgUser.expire !== undefined && pgUser.expire !== 0) {
                        let parsedDate: Date | null = null
                        if (typeof pgUser.expire === 'number') {
                            parsedDate = new Date(pgUser.expire * 1000)
                        } else if (typeof pgUser.expire === 'string') {
                            const num = Number(pgUser.expire)
                            if (!isNaN(num)) {
                                parsedDate = new Date(num * 1000)
                            } else {
                                parsedDate = new Date(pgUser.expire)
                            }
                        }

                        if (parsedDate && !isNaN(parsedDate.getTime())) {
                            liveExpireAt = parsedDate
                        }
                    }

                    // Map PasarGuard status
                    vpnStatus = pgUser.status === 'active' ? 'active'
                        : pgUser.status === 'expired' ? 'expired'
                            : pgUser.status === 'limited' ? 'limited'
                                : 'disabled'

                    // Update subscription URL if we got a fresh one
                    if (pgUser.subscription_url || pgUser.sub_url) {
                        subscriptionUrl = pgUser.subscription_url || pgUser.sub_url
                    }
                } else {
                    // User was deleted from PasarGuard! Sync deletion to local DB.
                    await prisma.user.delete({ where: { id: user.id } })
                    const cookieStore = await cookies()
                    cookieStore.delete('token')
                    return NextResponse.json({ error: 'Account was removed from the remote panel' }, { status: 403 })
                }
            } catch (pgError) {
                console.error('Failed to fetch PasarGuard user data:', pgError)
                // Fallback to DB data — don't fail the request
            }
        }

        // Determine overall status
        const status = !activeSub && vpnStatus !== 'active' ? 'inactive'
            : vpnStatus !== 'active' ? vpnStatus
                : 'active'

        return NextResponse.json({
            email: user.email,
            pasarguardId: user.pasarguardId || null,
            status,
            plan: activeSub ? activeSub.planName : 'Free',
            expiresAt: liveExpireAt ? liveExpireAt.toISOString() : null,
            usage: {
                usedGB: Math.round(usedTrafficGB * 100) / 100,
                limitGB: dataLimitGB ? Math.round(dataLimitGB * 100) / 100 : null,
            },
            onlineCount,
            subscriptionUrl,
            // If the user is online in PasarGuard, we show a dynamic device. Otherwise, we show historical DB devices.
            devices: onlineCount > 0 ? Array.from({ length: onlineCount }).map((_, i) => ({
                id: `active-pg-${i}`,
                name: `Active Connection (Gateway)`,
                lastSeen: new Date().toISOString(),
                revoked: false
            })) : user.devices.map((d: { id: string; deviceName: string; createdAt: Date; revoked: boolean }) => ({
                id: d.id,
                name: d.deviceName,
                lastSeen: d.createdAt.toISOString(),
                revoked: d.revoked,
            })),
            createdAt: user.createdAt.toISOString(),
        })

    } catch (error) {
        console.error("Get user error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
