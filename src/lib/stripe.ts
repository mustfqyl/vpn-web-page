import Stripe from "stripe";

// Stripe client singleton
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-02-24.acacia",
});

export { stripe };

// Helper functions for Stripe operations

export async function createCheckoutSession(params: {
    customerId: string;
    customerEmail: string;
    priceId?: string;
    successUrl: string;
    cancelUrl: string;
}) {
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: params.customerEmail,
        line_items: [
            {
                price: params.priceId || process.env.STRIPE_PRICE_ID!,
                quantity: 1,
            },
        ],
        metadata: {
            customerId: params.customerId,
        },
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
    });

    return session;
}

export async function createCustomer(email: string, name?: string) {
    const customer = await stripe.customers.create({
        email,
        name,
    });

    return customer;
}

export async function cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
}

export async function getSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
}

export async function constructWebhookEvent(
    payload: string,
    signature: string
): Promise<Stripe.Event> {
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
    );
}
