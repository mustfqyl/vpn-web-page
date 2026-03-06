import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST() {
    try {
        const cookieStore = await cookies()
        cookieStore.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            path: '/',
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
