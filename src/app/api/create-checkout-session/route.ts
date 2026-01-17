import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // apiVersion omitted to use default
});

export async function POST(req: Request) {
    try {
        const { userId, email } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Colleko Meetup Subscription',
                        },
                        unit_amount: 799, // $7.99
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/?payment_success=true`,
            cancel_url: `${req.headers.get('origin')}/?payment_cancelled=true`,
            metadata: {
                userId,
            },
            customer_email: email, // Pre-fill email if available
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
