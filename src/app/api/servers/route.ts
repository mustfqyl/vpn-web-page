import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // Check authentication (User or Device)
        // For device, it might send token in header 'Authorization: Bearer <device_token>'
        // Or cookie 'token' for user.

        // Let's support both or just Cookie for now as per previous phases.
        // The "Client" (Desktop App) uses Device Token usually? 
        // "Client login via code ... Return device_token".
        // "GET /api/sub Requires: device_token".
        // "GET /api/servers ... Client will use this".

        // Likely the client uses device_token.
        // Let's check Authorization header for device_token or query param?

        const { searchParams } = new URL(request.url)
        const tokenParams = searchParams.get('token')
        const cookieStore = await cookies()
        const cookieToken = cookieStore.get('token')?.value
        const authHeader = request.headers.get('Authorization')

        let isAuthenticated = false

        if (cookieToken) {
            // User Auth
            try {
                // verified decode
                if (verifyToken(cookieToken)) isAuthenticated = true
            } catch { }
        }

        if (!isAuthenticated && (tokenParams || authHeader)) {
            const deviceToken = tokenParams || authHeader?.replace('Bearer ', '')
            if (deviceToken) {
                const device = await prisma.device.findUnique({
                    where: { deviceToken } // Assuming deviceToken is unique
                })
                if (device && !device.revoked) isAuthenticated = true
            }
        }

        // If we want to strictly enforce auth:
        // if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // However, server list might be public for some use cases (checking latency before login).
        // Prompt said "All protected endpoints require auth" in Phase 6.
        // Let's assume it IS protected.

        if (!isAuthenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const start = parseInt(searchParams.get('start') || '0');
        const limit = parseInt(searchParams.get('limit') || '50');

        const nodes = await prisma.node.findMany({
            where: { active: true },
            skip: start,
            take: limit,
            orderBy: { country: 'asc' }
        })

        return NextResponse.json({ servers: nodes })

    } catch (error) {
        console.error("Server list error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
