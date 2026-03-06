import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth'
import crypto from 'crypto'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
    code: z.string().length(6),
    deviceName: z.string().min(1).default('Unknown Device'),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { code, deviceName } = loginSchema.parse(body)

        // Find valid, unused codes that haven't expired
        // Since we store hashed codes, we can't search by code directly easily if we used bcrypt with salt.
        // However, for short codes, we might want to search by userId if provided, but here request only has code.
        // Issue: Bcrypt is slow and we can't reverse it. We can't query `where code = input`.
        // We would need to iterate or store unhashed (bad) or use a deterministic hash (e.g. SHA256) for lookup.

        // Changing approach: 
        // The requirement said "Stored hashed in DB". 
        // If client only sends code, we can't identify the user to check the hash against.
        // Unless the code is unique globally? 6 chars is small collision space for global unique with hashing.
        // But 6 chars is standard for "enter code displayed on TV".
        // Usually the flow is: Device shows code -> User enters code on Web.
        // OR User shows code -> Device enters code?
        // The requirement: "Client login via code: POST /api/device/login Body: { code }"
        // This implies the User generated the code on Web (authenticated), and typed it into the Device?
        // "1. Generate 6-character alphanumeric login code... Endpoint: POST /api/device/generate-code" (Authenticated)
        // "2. Client login via code: POST /api/device/login" (Public/Device)

        // So User generates code on Web. Device sends code to API.
        // Since we can't lookup by hashed code, and 6 chars is small, maybe we shouldn't use bcrypt for lookup invalidation.
        // But requirement says "Stored hashed in DB".
        // Challenge: How to find the record?
        // Options:
        // 1. Store a "lookup key" separately?
        // 2. Iterate all valid codes? (Too expensive)
        // 3. User enters code AND email? (Not in requirements)

        // PROPOSAL: Since safety is Phase 6, and this is a constraint. 
        // If I use SHA256 for storage, I can query it.
        // But requirement said "hashed in DB". It didn't strictly say bcrypt for *this*. 
        // I used `hashPassword` (bcrypt) in `generate-code`. This makes it impossible to lookup.

        // CORRECTION: I should use a deterministic hash for the LoginCode or just SHA256. 
        // I will change `generate-code` to use SHA256 or similar, or just not hash it for lookup if I want strictly 6 chars. 
        // But "Stored hashed" implies security.

        // Let's assume I can't change the requirement "Stored hashed". 
        // I'll update `generate-code` to use SHA256 so I can look it up.

        // Wait, `hashPassword` in `src/lib/auth.ts` uses bcrypt.
        // I should create `hashToken` using SHA256 or similar in `src/lib/auth.ts` or locally.

        // I'll implement `api/device/login` using SHA256 logic, BUT I need to update `generate-code` first (or next).
        // I'll update `generate-code` in the next step to use SHA256.

        // For now, I'll write `device/login` assuming SHA256 layout.

        // Let's implement `device/login` to hash the input code with SHA256 and look it up.

        const hashedFn = (c: string) => crypto.createHash('sha256').update(c).digest('hex')
        const hashedInput = hashedFn(code.toUpperCase()) // Case insensitive?

        const loginCode = await prisma.loginCode.findFirst({
            where: {
                code: hashedInput,
                used: false,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: { user: true }
        })

        if (!loginCode) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
        }

        // Mark as used
        await prisma.loginCode.update({
            where: { id: loginCode.id },
            data: { used: true }
        })

        // Create Device Token
        const deviceToken = crypto.randomUUID()

        await prisma.device.create({
            data: {
                userId: loginCode.userId,
                deviceName,
                deviceToken,
            }
        })

        return NextResponse.json({ device_token: deviceToken, email: loginCode.user.email })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error("Device login error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

