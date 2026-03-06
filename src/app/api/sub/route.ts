import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pasarguardService } from '@/lib/pasarguard'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const deviceToken = searchParams.get('token') // Or header? Prompt says "Requires: device_token"

        // Usually clients send token in query or header. 
        // Requirement said: "GET /api/sub Requires: device_token"

        if (!deviceToken) {
            return NextResponse.json({ error: 'Device token required' }, { status: 400 })
        }

        // Find device
        const device = await prisma.device.findUnique({
            where: { deviceToken }, // Assuming schema has unique constraint on deviceToken
            include: { user: { include: { subscriptions: true } } }
        })

        if (!device) {
            return NextResponse.json({ error: 'Invalid device token' }, { status: 401 })
        }

        if (device.revoked) {
            return NextResponse.json({ error: 'Device revoked' }, { status: 403 })
        }

        // Check active subscription
        const activeSub = device.user.subscriptions.find(sub => sub.active && sub.expiresAt > new Date())

        if (!activeSub) {
            return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
        }

        // Fetch subscription content from PasarGuard
        const subUrl = device.user.pasarguardSubUrl

        if (!subUrl) {
            // Maybe create user in PasarGuard now if not exists?
            // Or error out.
            // Let's assume user should have been created during payment.
            return NextResponse.json({ error: 'Subscription not configured' }, { status: 500 })
        }

        try {
            const content = await pasarguardService.getSubscriptionContent(subUrl)

            return new NextResponse(content, {
                status: 200,
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                }
            })

        } catch (pError) {
            return new NextResponse('Failed to fetch subscription content', { status: 502 })
        }

    } catch (error) {
        console.error("Sub proxy error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
