import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { customerId, customerEmail } = await request.json();

        if (!customerId || !customerEmail) {
            return NextResponse.json(
                { error: "Customer bilgileri gereklidir" },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const session = await createCheckoutSession({
            customerId,
            customerEmail,
            successUrl: `${baseUrl}/dashboard?payment=success`,
            cancelUrl: `${baseUrl}/pricing?payment=cancelled`,
        });

        return NextResponse.json({
            success: true,
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Ödeme sayfası oluşturulamadı" },
            { status: 500 }
        );
    }
}
