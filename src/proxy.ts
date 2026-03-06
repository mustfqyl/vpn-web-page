import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-me'
const key = new TextEncoder().encode(JWT_SECRET)

export async function proxy(request: NextRequest) {
    const protectedPaths = ['/dashboard', '/api/mock-payment', '/api/device', '/api/sub', '/api/servers']

    // Check if the current path starts with any of the protected paths
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (isProtected) {
        const token = request.cookies.get('token')?.value

        if (!token) {
            if (request.nextUrl.pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            await jwtVerify(token, key)
            // Token is valid
            return NextResponse.next()
        } catch (error) {
            // Token is invalid
            if (request.nextUrl.pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
